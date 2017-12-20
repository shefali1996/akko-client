import {signOutUser} from '../libs/awsLib.js';

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
  },
  getUser() {
    return JSON.parse(window.localStorage.getItem(authUser));
  }
};
