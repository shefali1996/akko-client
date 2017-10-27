export default {
    authenticate (token, user) {
        window.localStorage.setItem('authToken', token)
        window.localStorage.setItem('authUser', JSON.stringify(user))
    },

    logout () {
        window.localStorage.removeItem('authToken')
        window.localStorage.removeItem('authUser')
    },

    get isAuthenticated () {
        return window.localStorage.getItem('authToken')
    },

    get token () {
        return window.localStorage.getItem('authToken')
    },

    get id () {
        let authUser = window.localStorage.getItem('authUser')
        if(authUser) {
            authUser = JSON.parse(authUser)
            return authUser._id;
        }
        return null;
    },

    get username () {
        authUser = window.localStorage.getItem('authUser')
        if(authUser) {
            authUser = JSON.parse(authUser)
            return authUser.email;
        }
        return null;
    },

    get role () {
        authUser = window.localStorage.getItem('authUser')
        if(authUser) {
            authUser = JSON.parse(authUser)
            return authUser.role;
        }
        return null;
    },

    setUser(user) {
        window.localStorage.setItem('authUser', JSON.stringify(user))
    }
};
