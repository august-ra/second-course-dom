"use strict"


import { comments } from "./comments.js"


/* common functions */

function zeroPad(num, places) {
    return String(num).padStart(places, "0")
}

Date.prototype.print = (date = null, withSeconds = false) => {
    if (date === null)
        date = new Date()
    else if (typeof date === "string")
        date = new Date(date)

    const parts = []
    parts.push(zeroPad(date.getDate(), 2))
    parts.push(".")
    parts.push(zeroPad(date.getMonth() + 1, 2))
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

    return parts.join("")
}

String.prototype.sterilize = function () {
    return this
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("/", "&sol;")
}


/* common variables */

const root      = document.querySelector(":root")
const lstComments = document.getElementById("comment-list")
const txtName     = document.getElementById("name-input")
const txtQuote    = document.getElementById("quote-input")
const txtComment  = document.getElementById("comment-input")
const boxQuote    = document.getElementById("quote-box")
const lblQuote    = document.getElementById("quote-text")
const btnCancelQ  = document.getElementById("quote-cancel")
const btnSubmit   = document.getElementById("comment-add")
const btnRemove   = document.getElementById("comment-remove")
const txtAll    = [txtName, txtComment]

let takingText = false


/* init state for submit */

btnSubmit.disabled = true


/* element's working functions */

function jumpTo(element) {
    if (element)
        element.scrollIntoView({behavior: "smooth"})
}

function getValue(element) {
    return element.value.trim()
}

function insertInputEmptyStatus(element) {
    element.classList.add("add-form--error")
}

function removeEmptyInputStatus(element) {
    element.classList.remove("add-form--error")
}

function updateCommentBoxes() {
    document.querySelectorAll(".comment").forEach((box) => {
        box.addEventListener("click", () => {
            document.querySelector(".comment-editor").scrollIntoView()

            const recordId = Number(box.dataset.id)

              txtQuote.value = recordId
            txtComment.value = comments.printQuote(recordId, lblQuote)

            const element = lblQuote.parentElement

            root.style.setProperty(
                "--padding-for-comment",
                `${element.clientHeight + 26}px`
            )

            txtComment.classList.add("add-form-text--inclusive")
            txtComment.classList.remove("add-form-text--alone")

            element.classList.add("quote--visible")
            element.classList.remove("quote--invisible")
        })
    })
}

function updateCommentQuote() {
    document.querySelectorAll(".comment-quote").forEach((quote) => {
        quote.addEventListener("click", (e) => {
            const recordId = Number(quote.dataset.quoteid)
            const element = document.querySelector(`.comment[data-id="${recordId}"]`)

            e.stopPropagation()

            jumpTo(element)
        })
    })
}

function updateLikeButtons() {
    document.querySelectorAll(".like-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            const recordId = Number(button.dataset.id)
            comments.updateLikeStatus(recordId)

            e.stopPropagation()

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
    if (e.key === "Enter" && !btnSubmit.disabled) {
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

boxQuote.addEventListener("click", (e) => {
    const recordId = Number(txtQuote.value)
    const element = document.querySelector(`.comment[data-id="${recordId}"]`)

    e.stopPropagation()

    jumpTo(element)
})

btnCancelQ.addEventListener("click", (e) => {
    lblQuote.innerHTML = ""
    txtQuote.value     = ""

    txtComment.classList.add("add-form-text--alone")
    txtComment.classList.remove("add-form-text--inclusive")

    const element = lblQuote.parentElement
    element.classList.add("quote--invisible")
    element.classList.remove("quote--visible")

    e.stopPropagation()
})

btnSubmit.addEventListener("click", () => {
    let name    = getValue(txtName)
    let quoteID = getValue(txtQuote)
    let comment = getValue(txtComment)

    if (name.length <= 3 || !comment)
        return

    document.querySelector(".add-form-row").scrollIntoView()

       txtName.focus()
       txtName.value = ""
      txtQuote.value = ""
    txtComment.value = ""

    btnCancelQ.click()

    btnSubmit.disabled = true

    comments.sendCommentToServer(name.sterilize(), comment.sterilize(), render)
})

btnRemove.addEventListener("click", () => {
    if (lstComments.children.length === 0)
        return

    comments.deleteLast()

    render()
})


/* render function */

function render() {
    lstComments.innerHTML = comments.printListItems()

    updateCommentBoxes()
    updateCommentQuote()
    updateLikeButtons()
}


/* start */

comments.getCommentsFromServer(render)