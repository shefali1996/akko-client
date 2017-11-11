import { CognitoUserPool } from "amazon-cognito-identity-js";
import config from "../config";
import AWS from "aws-sdk";
import sigV4Client from "./sigV4Client";
import apigClientFactory from "./apigClient"

function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.cognito
    .REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}

export async function authUser() {
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return true;
  }
  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

let userToken = null;
try{
  userToken = await getUserToken(currentUser);
}catch(e)
{
  alert(e);
}

try{
  await getAwsCredentials(userToken);
}catch(e)
{
  alert(e);
}

  return true;
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
}

// Sign out a user
export function signOutUser() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({});
  }
}

export async function invokeApigUnAuth({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  body
}) {

  console.log("Entered function");

  AWS.config.update({ region: config.cognito.REGION });

  var cognitoidentity = new AWS.CognitoIdentity();
  var params = {
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID
  };

  // Generate a Cognito ID for the 1st time, so IdentityId could be kept for future use
  cognitoidentity.getId(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response

    var params = {
      IdentityId: data.IdentityId
    };

    // Retrieve temp credentials with IdentityId
    cognitoidentity.getCredentialsForIdentity(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response

      var apigClient = apigClientFactory.newClient({
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretKey,
        sessionToken: data.Credentials.SessionToken,
        region: config.cognito.REGION
      });

      var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        path: path,
        method: method,
        headers: headers,
        queryParams: queryParams,
        body: body,
      };

      apigClient.demoGet(params).then(function(result) {
        //This is where you would put a success callback
        console.log(result);
        alert("Hello foo!");
      }).catch(function(result) {
        //This is where you would put an error callback
        console.log(result);
        alert("Oops foo!");
      });
    })

  });
}

// Invoke API gateway
export async function invokeApig({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  body
}) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: config.apiGateway.REGION,
      endpoint: config.apiGateway.URL
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  body = body ? JSON.stringify(body) : body;
  headers = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers,
    body
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}
