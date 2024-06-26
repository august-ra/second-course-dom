import { API } from "./api.js"
import { DOM } from "./DOM.js"


export const comments = {
    data: [],

    addRecordWhileOffline(name, comment, quoteID="") {
        const isMine = (name === "@august-ra")
        const count  = new Date().getTime()

        this.data.push({
            id:      count,
            name:    name,
            date:    new Date().print(),
            quoteID: quoteID,
            comment: comment,
            marks:   0,
            isLiked: false,
            isMine:  isMine,
        })
    },

    getCommentById(id) {
        return this.data.filter((item) => item.id === id)[0]
    },

    deleteLast() {
        const id = this.data[this.data.length - 1].id

        API.deleteCommentFromServer(id)
            .then((data) => {
                if (data.result === "ok")
                    this.getCommentsFromServer()
            })
    },

    updateLikeStatus(id) {
        const record = this.getCommentById(id)

        if (!record)
            return

        API.toggleLike(id)
            .then((data) => {
                record.isLiked = data.result.isLiked
                record.marks   = data.result.likes

                DOM.renderApp()
            })
    },

    printQuote(id, toElement) {
        const record = this.getCommentById(id)

        toElement.innerHTML =  record.comment
        return `${record.name}, `
        // return `<b>${record.name},</b> `
    },

    printListItems() {
        return this.data.map((record) => {
            const commentCl = `comment${record.isMine ? " comment--mine" : ""}`
            const buttonCl  = `like-button${record.isLiked ? " like-button--active" : ""}`
            const dataId    = `data-id="${record.id}"`

            const printQuote = () => {
                if (!record.quoteID)
                    return ""

                const quote = this.data[record.quoteID]
                const dataId = `data-quoteid="${record.quoteID}"`

                return `<div class="comment-text comment-quote" ${dataId}>
                    ${quote.comment}
                </div>`
            }

            return `<li class="${commentCl}" ${dataId}>
                <div class="comment-header">
                    <div>${record.name}</div>
                    <div>${record.date}</div>
                </div>
                <div class="comment-body">
                    ${printQuote()}
                    <div class="comment-text">
                        ${record.comment}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${record.marks}</span>
                        <button class="${buttonCl}" ${dataId}></button>
                    </div>
                </div>
            </li>`
        }).join('')
    },

    getCommentsFromServer() {
        API.changeLoading = this.changeLoading

        return API.getCommentsFromServer()
            .then((data) => {
                this.data = data.comments.map((record) => {
                    return {
                        id:      record.id,
                        name:    record.author.name,
                        date:    new Date(record.date).print(),
                        quoteID: "",
                        comment: record.text,
                        marks:   record.likes,
                        isLiked: record.isLiked,
                        isMine:  (record.author.name === "@august-ra"),
                    }
                })

                DOM.updateLoadingState(false)
                DOM.renderApp()
            })
            .catch(API.handleError)
    },

    sendCommentToServer(comment) {
        API.changeLoading = this.changeLoading

        API.sendCommentToServer(comment)
            .then((data) => {
                if (data === "error")
                    return Promise.reject()

                this.getCommentsFromServer()
            })
            .then(() => {
                DOM.clearInputs()
            })
            .catch(API.handleError)
    },
}
