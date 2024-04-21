import { DOM } from "./DOM.js"


export const API = {
    commentsURI: "https://wedev-api.sky.pro/api/v1/@august-ra/comments", // GET (read) + POST (send)

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
    },

    getCommentsFromServer() {
        return this.getDataFromEndpoint(this.commentsURI, {})
    },

    sendCommentToServer(name, comment) {
        const params = {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: comment,
            })
        }

        return this.getDataFromEndpoint(this.commentsURI, params)
    },

    handleError(error) {
        if (error.message === "Failed to fetch")
            alert("Произошла ошибка, проверьте доступность сети Интернет")
        else
            alert(error.message)

        DOM.updateLoadingState(false)
    },
}
