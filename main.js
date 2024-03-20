"use strict"


/* common functions */

function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

function printDate(date = null, withSeconds = false) {
    if (date === null)
        date = new Date()
    else if (typeof date === "string")
        date = new Date(date)

    const parts = []
    parts.push(zeroPad(date.getDate(), 2))
    parts.push(".")
    parts.push(zeroPad(date.getMonth(), 2))
    parts.push(".")
    parts.push(date.getFullYear().toString().substring(2))
    parts.push(" ")
    parts.push(zeroPad(date.getHours(), 2))
    parts.push(":")
    parts.push(zeroPad(date.getMinutes(), 2))

    if (withSeconds) {
        parts.push(":")
        parts.push(zeroPad(date.getSeconds(), 2))
    }

    return parts.join('')
}


/* main data */

let data = [
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
]


/* common variables */

const lstComments = document.getElementById("comment-list")
const txtName     = document.getElementById("name-input")
const txtComment  = document.getElementById("comment-input")
const btnSubmit   = document.getElementById("comment-add")
const btnRemove   = document.getElementById("comment-remove")
const txtAll    = [txtName, txtComment]

let takingText = false


/* init state for submit */

btnSubmit.disabled = true


/* element's working functions */

function getValue(element) {
    return element.value.trim()
}

function insertInputEmptyStatus(element) {
    element.classList.add("add-form--error")
}

function removeEmptyInputStatus(element) {
    element.classList.remove("add-form--error")
}

function updateLikeButtons() {
    document.querySelectorAll(".like-button").forEach((button) => {
        button.addEventListener("click", () => {
            const recordId = Number(button.dataset.id)
            const record = data[recordId]

            if (button.classList.contains("like-button--active")) {
                button.classList.remove("like-button--active")

                record.isLiked = false
                record.marks  -= 1
            }
            else {
                button.classList.add("like-button--active")

                record.isLiked = true
                record.marks  += 1
            }

            render()
        })
    })
}


/* listeners */

txtName.addEventListener("dblclick", (e) => {
    if (!getValue(txtName) && e.button === 0) {
        txtName.value = "@august-ra"

        removeEmptyInputStatus(txtName)

        if (getValue(txtComment))
            btnSubmit.disabled = false
    }
})

txtAll.forEach((element) => element.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' && !btnSubmit.disabled) {
        btnSubmit.click()
        e.preventDefault()
        e.stopPropagation()

        removeEmptyInputStatus(element)

        takingText = true

        btnSubmit.disabled = true
    }
}))

txtAll.forEach((element) => element.addEventListener("keyup", () => {
    const name    = getValue(txtName)
    const comment = getValue(txtComment)

    let forcedBlock       = false
    let wasErrorInName    = name.length <= 3
    let wasErrorInComment = !comment

    if (element === txtName && wasErrorInName || element === txtComment && wasErrorInComment)
        insertInputEmptyStatus(element)
    else
        removeEmptyInputStatus(element)

    if (takingText) {
        removeEmptyInputStatus(element)

        forcedBlock = true
        takingText  = false
    }

    btnSubmit.disabled = forcedBlock || wasErrorInName || wasErrorInComment
}))

btnSubmit.addEventListener("click", () => {
    let name    = getValue(txtName)
    let comment = getValue(txtComment)
    let isMine = (name === "@august-ra")

    if (name.length <= 3 || !comment)
        return

    txtName.value    = ""
    txtComment.value = ""

    txtName.focus()

    const count = new Date().getTime()

    data.push({
        id: count,
        name: name,
        date: printDate(),
        comment: comment,
        marks: 0,
        isLiked: false,
        isMine: isMine,
    })

    render()
})

btnRemove.addEventListener("click", () => {
    if (lstComments.children.length === 0)
        return

    data.pop()
    render()
})


/* render function */

function render() {
    lstComments.innerHTML = data.map((record) => {
        const commentCl = `comment${record.isMine ? " comment--mine" : ""}`
        const buttonCl  = `like-button${record.isLiked ? " like-button--active" : ""}`
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

    updateLikeButtons()
}


/* start */

render()
