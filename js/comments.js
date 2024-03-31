"use strict"

export const comments = {
    data: [],

    addRecord(name, comment, quoteID="") {
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

    deleteLast() {
        this.data.pop()
    },

    updateLikeStatus(id) {
        const record = this.data[id]

        if (record.isLiked) {
            record.isLiked = false
            record.marks  -= 1
        } else {
            record.isLiked = true
            record.marks  += 1
        }
    },

    printQuote(id, toElement) {
        const record = this.data[id]

        toElement.innerHTML =  record.comment
        return `${record.name}, `
        // return `<b>${record.name},</b> `
    },

    printListItems() {
        return this.data.map((record, index) => {
            const commentCl = `comment${record.isMine ? " comment--mine" : ""}`
            const buttonCl  = `like-button${record.isLiked ? " like-button--active" : ""}`
            const dataId    = `data-id="${index}"`

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

    getCommentsFromServer(do_render) {
        fetch("https://wedev-api.sky.pro/api/v1/@august-ra/comments")
            .then((response) => response.json())
            .then((data) => {
                this.data = data.comments.map((record) => {
                    return {
                        id:      record.id,
                        name:    record.author.name,
                        date:    record.date,
                        quoteID: "",
                        comment: record.text,
                        marks:   record.likes,
                        isLiked: record.isLiked,
                        isMine:  (record.author.name === "@august-ra"),
                    }
                })

                do_render()
            })
            .catch((error) => console.log(error))
    },

    sendCommentToServer(name, comment, do_render) {
        const params = {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: comment,
            })
        }
        let statusCode = 0

        fetch("https://wedev-api.sky.pro/api/v1/@august-ra/comments", params)
            .then((response) => {
                statusCode = response.status

                return response.json()
            })
            .then((data) => {
                if (statusCode === 400)
                    throw new Error(data.error)

                this.getCommentsFromServer(do_render)
            })
            .catch((error) => console.log(error))
    },
}
