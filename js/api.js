import { DOM } from "./DOM.js"


export const API = {
    username: "",
    token:    "",

    commentsURI: "https://wedev-api.sky.pro/api/v2/@august-ra/comments", // GET (read) + POST (send)
    signInURI:   "https://wedev-api.sky.pro/api/user/login", // POST
    signUpURI:   "https://wedev-api.sky.pro/api/user", // POST

    getDataFromEndpoint(endpoint, params) {
        let statusCode = 0

        return fetch(endpoint, params)
            .then((response) => {
                statusCode = response.status

                return response.json()
            })
            .then((data) => {
                if (statusCode === 400)
                    throw new Error(data.error)
                if (statusCode === 500)
                    throw new Error("Произошла ошибка на сервере. Код ответа 500")

                return data
            })
            .catch((error) => {
                if (error.message === "Failed to fetch")
                    alert("Произошла ошибка, проверьте доступность сети Интернет")
                else
                    alert(error.message)

                return "error"
            })
    },

    getCommentsFromServer() {
        let params

        if (this.token)
            params = {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        else
            params = {}

        return this.getDataFromEndpoint(this.commentsURI, params)
    },

    sendCommentToServer(comment) {
        const params = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
                text: comment,
            })
        }

        return this.getDataFromEndpoint(this.commentsURI, params)
    },

    toggleLike(commentID) {
        const params = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }

        return this.getDataFromEndpoint(`${this.commentsURI}/${commentID}/toggle-like`, params)
    },

    deleteCommentFromServer(commentID) {
        const params = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }

        return this.getDataFromEndpoint(`${this.commentsURI}/${commentID}`, params)
    },

    signIn(login, password) {
        const params = {
            method: "POST",
            body: JSON.stringify({
                login:    login,
                password: password,
            })
        }

        return this.getDataFromEndpoint(this.signInURI, params)
    },

    signUp(name, login, password) {
        const params = {
            method: "POST",
            body: JSON.stringify({
                name:     name,
                login:    login,
                password: password,
            })
        }

        return this.getDataFromEndpoint(this.signUpURI, params)
    },

    handleError(error) {
        if (error)
            throw error

        DOM.updateLoadingState(false)
    },
}
