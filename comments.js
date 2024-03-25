"use strict"

export const comments = {
    data: [
        {
            id:      0,
            name:    "Глеб Фокин",
            date:    "12.02.22 12:18",
            quoteID: "",
            comment: "Это будет первый комментарий на этой странице",
            marks:   3,
            isLiked: false,
            isMine:  false,
        },
        {
            id:      1,
            name:    "Варвара Н.",
            date:    "13.02.22 19:22",
            quoteID: "",
            comment: "Мне нравится, как оформлена эта страница! ❤",
            marks:   75,
            isLiked: true,
            isMine:  false,
        },
        {
            id:      2,
            name:    "@august-ra",
            date:    "17.03.24 13:05",
            quoteID: "",
            comment: "есть-таки вопросики к дизайнеру.. ))",
            marks:   1,
            isLiked: false,
            isMine:  true,
        },
        {
            id:      3,
            name:    "@august-ra",
            date:    "23.03.24 23:32",
            quoteID: "1",
            comment: "Варвара Н., дизайн, конечно, бомба.. ))",
            marks:   1,
            isLiked: false,
            isMine:  true,
        },
    ],

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
}
