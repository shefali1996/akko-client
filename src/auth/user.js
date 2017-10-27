export default {
    get isAuthenticated () {
        return window.localStorage.getItem('isAuthenticated')
    },
    logout () {
        window.localStorage.removeItem('isAuthenticated')
    },
    setUser(user) {
        window.localStorage.setItem('authUser', JSON.stringify(user))
    }
};
