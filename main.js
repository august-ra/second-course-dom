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
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("/", "&sol;")
}


/* common variables */

const lstComments = document.getElementById("comment-list")
const txtName     = document.getElementById("name-input")
const txtQuote    = document.getElementById("quote-input")
const txtComment  = document.getElementById("comment-input")
const boxQuote    = document.getElementById("quote-text")
const btnCancelQ  = document.getElementById("quote-cancel")
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

function jumpTo(element) {
    if (element)
        element.scrollIntoView({behavior: "smooth"})
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
            txtComment.value = comments.printQuote(recordId, boxQuote)

            const element = boxQuote.parentElement
            txtComment.style.transition = "padding-top 0.18s ease-in-out"
            txtComment.style.paddingTop = `${element.clientHeight + 26}px`

            element.style.transition = "opacity 0.4s ease-in-out, left 0.6s ease-in-out"
            element.style.opacity    = "1"
            element.style.left       = "22px"
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

btnCancelQ.addEventListener("click", () => {
    boxQuote.innerHTML = ""
    txtQuote.value     = ""

    txtComment.style.transition = "padding-top 0.7s ease-in-out"
    txtComment.style.paddingTop = "22px"

    const element = boxQuote.parentElement
    element.style.transition = "opacity 0.7s ease-in-out, left 0.6s ease-in-out"
    element.style.opacity    = "0"
    element.style.left       = "75px"
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

    boxQuote.innerHTML = ""
    txtQuote.value     = ""

    txtComment.style.paddingTop = "22px"

    const element = boxQuote.parentElement
    element.style.transition = ""
    element.style.opacity    = "0"
    element.style.left       = "75px"

    comments.addRecord(name.sterilize(), comment.sterilize(), quoteID)

    render()
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

render()
