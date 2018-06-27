import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import swal from 'sweetalert2';
import config from '../config';
import sigV4Client from './sigV4Client';

function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.cognito
    .REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins:         {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}

let authPromise = null;

export async function authUser() {
  // This avoids multiple calls to authUser
  // If a pending promise is available, return that
  if (authPromise) {
    return authPromise;
  }

  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return Promise.resolve();
  }
  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return Promise.reject('currentUser is null');
  }

  authPromise = getUserToken(currentUser).then((userToken) => {
    return getAwsCredentials(userToken);
  });

  await authPromise;

  authPromise = null;
  return Promise.resolve();
}

async function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession((err, session) => {
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
    ClientId:   config.cognito.APP_CLIENT_ID
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

// Invoke API gateway
export async function invokeApig({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  return authUser().then(() => {
    const signedRequest = sigV4Client
      .newClient({
        accessKey:    AWS.config.credentials.accessKeyId,
        secretKey:    AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        region:       config.apiGateway.REGION,
        endpoint:     config.apiGateway.URL
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
    console.log('signedRequest', signedRequest);
    return fetch(signedRequest.url, {
      method,
      headers,
      body
    });
  });
}
