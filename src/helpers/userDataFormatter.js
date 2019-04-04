export const userDataFormatter = data => {
  const body = {
    user_name: data.user_name || "",
    company: data.company || "",
    user_timezone: data.user_timezone || "",
    company_website: data.website || "",
    loc_country: data.loc_country || "",
    loc_state: data.loc_state || "",
    loc_city: data.loc_city || "",
    plan: data.userPlan || "",
    company_website:data.company_website||""
  };
  return body;
};
