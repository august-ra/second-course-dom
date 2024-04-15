import { comments } from "./comments.js"


export const DOM = {
    root:        document.querySelector(":root"),
    lstComments: document.getElementById("comment-list"),
    txtName:     document.getElementById("name-input"),
    txtQuote:    document.getElementById("quote-input"),
    txtComment:  document.getElementById("comment-input"),
    boxQuote:    document.getElementById("quote-box"),
    lblQuote:    document.getElementById("quote-text"),
    btnCancelQ:  document.getElementById("quote-cancel"),
    btnSubmit:   document.getElementById("comment-add"),
    btnRemove:   document.getElementById("comment-remove"),
    gifLoader:   document.getElementById("loader"),

    takingText: false,

    state: {
        waitingAuthor:      true,
        singingAuthor:      false,
        registrationAuthor: false,
        sendingNew:         false,
    },


    /* element's working functions */

    jumpTo(element) {
        if (element)
            element.scrollIntoView({behavior: "smooth"})
    },

    getValue(element) {
        return element.value.trim()
    },

    clearInputs() {
        this.txtName.value    = ""
        this.txtQuote.value   = ""
        this.txtComment.value = ""
    },

    insertInputEmptyStatus(element) {
        element.classList.add("add-form--error")
    },

    removeEmptyInputStatus(element) {
        element.classList.remove("add-form--error")
    },

    updateLoadingState(show) {
        clearIntroducer()

        if (show)
            this.gifLoader.classList.remove("hidden")
        else
            this.gifLoader.classList.add("hidden")
    },


    /* listeners */

    handleListenersForAddForm() {
        this.txtName.addEventListener("dblclick", (e) => {
            if (!this.getValue(this.txtName) && e.button === 0) {
                this.txtName.value = "@august-ra"

                this.removeEmptyInputStatus(this.txtName)

                if (this.getValue(this.txtComment))
                    this.btnSubmit.disabled = false
            }
        })

        const txtAll = [this.txtName, this.txtComment]

        txtAll.forEach((element) => {
            element.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !this.btnSubmit.disabled) {
                    this.btnSubmit.click()
                    e.preventDefault()
                    e.stopPropagation()

                    this.removeEmptyInputStatus(element)

                    this.takingText = true

                    this.btnSubmit.disabled = true
                }
            })

            element.addEventListener("keyup", () => {
                const name = this.getValue(this.txtName)
                const comment = this.getValue(this.txtComment)

                let forcedBlock = false
                let wasErrorInName = name.length <= 3
                let wasErrorInComment = !comment

                if (element === this.txtName && wasErrorInName || element === this.txtComment && wasErrorInComment)
                    this.insertInputEmptyStatus(element)
                else
                    this.removeEmptyInputStatus(element)

                if (this.takingText) {
                    this.removeEmptyInputStatus(element)

                    forcedBlock = true
                    this.takingText = false
                } else if (!this.gifLoader.classList.contains("hidden")) {
                    forcedBlock = true
                }

                this.btnSubmit.disabled = forcedBlock || wasErrorInName || wasErrorInComment
            })
        })

        this.boxQuote.addEventListener("click", (e) => {
            const recordId = Number(this.txtQuote.value)
            const element = document.querySelector(`.comment[data-id="${recordId}"]`)

            e.stopPropagation()

            this.jumpTo(element)
        })

        this.btnCancelQ.addEventListener("click", (e) => {
            this.lblQuote.innerHTML = ""
            this.txtQuote.value     = ""

            this.txtComment.classList.add("input--alone")
            this.txtComment.classList.remove("input--inclusive")

            const element = this.lblQuote.parentElement
            element.classList.add("quote--invisible")
            element.classList.remove("quote--visible")

            e.stopPropagation()
        })

        this.btnSubmit.addEventListener("click", () => {
            let name    = this.getValue(this.txtName)
            let quoteID = this.getValue(this.txtQuote)
            let comment = this.getValue(this.txtComment)

            if (name.length <= 3 || !comment)
                return

            name    =    name.sterilize()
            comment = comment.sterilize()

            this.updateLoadingState(true)

            this.txtName.focus()
            this.btnCancelQ.click()

            this.btnSubmit.disabled = true

            comments.sendCommentToServer(name, comment)
        })

        this.btnRemove.addEventListener("click", () => {
            if (!comments.deleteLast())
                return

            this.renderApp()
        })

    },

    handleCommentBoxes() {
        document.querySelectorAll(".comment").forEach((box) => {
            box.addEventListener("click", () => {
                document.querySelector(".comment-editor").scrollIntoView()

                const recordId = Number(box.dataset.id)

                this.txtQuote.value   = recordId
                this.txtComment.value = comments.printQuote(recordId, this.lblQuote)

                const element = this.lblQuote.parentElement

                this.root.style.setProperty(
                    "--padding-for-comment",
                    `${element.clientHeight + 26}px`
                )

                this.txtComment.classList.add("input--inclusive")
                this.txtComment.classList.remove("input--alone")

                element.classList.add("quote--visible")
                element.classList.remove("quote--invisible")
            })
        })
    },

    handleCommentQuote() {
        document.querySelectorAll(".comment-quote").forEach((quote) => {
            quote.addEventListener("click", (e) => {
                const recordId = Number(quote.dataset.quoteid)
                const element = document.querySelector(`.comment[data-id="${recordId}"]`)

                e.stopPropagation()

                this.jumpTo(element)
            })
        })
    },

    handleLikeButtons() {
        document.querySelectorAll(".like-button").forEach((button) => {
            button.addEventListener("click", (e) => {
                const recordId = Number(button.dataset.id)
                comments.updateLikeStatus(recordId)

                e.stopPropagation()

                this.renderApp()
            })
        })
    },


    /* render function */

    renderApp() {
        this.lstComments.innerHTML = comments.printListItems()

        this.handleCommentBoxes()
        this.handleCommentQuote()
        this.handleLikeButtons()
    },


    /* start working */

    start() {
        this.btnSubmit.disabled = true

        this.handleListenersForAddForm()

        comments.getCommentsFromServer()
    },
}
