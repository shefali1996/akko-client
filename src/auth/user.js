export default {
  get isAuthenticated() {
    return window.localStorage.getItem('isAuthenticated');
  },
  logout() {
    window.localStorage.removeItem('isAuthenticated');
    window.localStorage.removeItem('inventoryInfo');
    window.localStorage.removeItem('productInfo');
  },
  setUser(user) {
    window.localStorage.setItem('authUser', JSON.stringify(user))
  }
};
