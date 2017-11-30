import signOutUser from "../libs/awsLib.js"

export default {
  get isAuthenticated() {
    return window.localStorage.getItem('isAuthenticated');
  },
  logout() {
    signOutUser();
    window.localStorage.clear();
  },
  setUser(user) {
    window.localStorage.setItem('authUser', JSON.stringify(user));
  }
};
