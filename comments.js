"use strict"

export const comments = {
    data: [
        {
            id: 0,
            name: 'Глеб Фокин',
            date: '12.02.22 12:18',
            comment: 'Это будет первый комментарий на этой странице',
            marks: 3,
            isLiked: false,
            isMine: false,
        },
        {
            id: 1,
            name: 'Варвара Н.',
            date: '13.02.22 19:22',
            comment: 'Мне нравится как оформлена эта страница! ❤',
            marks: 75,
            isLiked: true,
            isMine: false,
        },
        {
            id: 2,
            name: '@august-ra',
            date: '17.03.24 13:05',
            comment: 'есть-таки вопросики к дизайнеру.. ))',
            marks: 1,
            isLiked: false,
            isMine: true,
        },
    ],

    addRecord(name, comment,) {
        const isMine = (name === "@august-ra")
        const count = new Date().getTime()

        this.data.push({
            id: count,
            name: name,
            date: new Date().print(),
            comment: comment,
            marks: 0,
            isLiked: false,
            isMine: isMine,
        })
    },

    deleteLast() {
        this.data.pop()
    },

    updateLikeStatus(id) {
        const record = this.data[id]

        if (record.isLiked) {
            record.isLiked = false
            record.marks -= 1
        } else {
            record.isLiked = true
            record.marks += 1
        }
    },

    printListItems() {
        return this.data.map((record) => {
            const commentCl = `comment${record.isMine ? " comment--mine" : ""}`
            const buttonCl = `like-button${record.isLiked ? " like-button--active" : ""}`
            const dataId = `data-id="${record.id}"`

            return `<li class="${commentCl}">
                <div class="comment-header">
                    <div>${record.name}</div>
                    <div>${record.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">
                        ${record.comment}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter" ${dataId}>${record.marks}</span>
                        <button class="${buttonCl}" ${dataId}></button>
                    </div>
                </div>
            </li>`
        }).join('')
    },
}
