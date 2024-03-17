"use strict"

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

const lstComments = document.getElementById("comment-list")
const txtName     = document.getElementById("name-input")
const txtComment  = document.getElementById("comment-input")
const btnSubmit   = document.getElementById("comment-add")
const btnRemove   = document.getElementById("comment-remove")
const txtAll    = [txtName, txtComment]

let takingText = false

btnSubmit.disabled = true

function insertInputEmptyStatus(element) {
    element.classList.add("add-form--error")
}

function removeEmptyInputStatus(element) {
    element.classList.remove("add-form--error")
}

txtName.addEventListener("dblclick", (e) => {
    if (!txtName.value && e.button === 0) {
        txtName.value = "@august-ra"

        removeEmptyInputStatus(txtName)

        if (txtComment.value)
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
    if (txtName.value.length <= 3 || !txtComment.value.length) {
        if (element === txtComment && !element.value || element === txtName && element.value.length <= 3)
            insertInputEmptyStatus(element)
        else
            removeEmptyInputStatus(element)

        btnSubmit.disabled = true
    }
    else {
        removeEmptyInputStatus(element)

        btnSubmit.disabled = false
    }

    if (takingText) {
        removeEmptyInputStatus(element)

        takingText = false

        btnSubmit.disabled = true
    }
}))

btnSubmit.addEventListener("click", () => {
    let name     = txtName.value
    let comment  = txtComment.value
    let isMine = (name === "@august-ra")

    if (name.length <= 3 || !comment)
        return

    txtName.value    = ""
    txtComment.value = ""

    txtName.focus()

    lstComments.innerHTML += `
        <li class="comment${isMine ? " comment--mine" : ""}">
          <div class="comment-header">
            <div>${name}</div>
            <div>${printDate()}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">0</span>
              <button class="like-button"></button>
            </div>
          </div>
        </li>`
})

btnRemove.addEventListener("click", () => {
    const index = lstComments.children.length - 1

    if (index < 0)
        return

    lstComments.removeChild(lstComments.children[index])
})
