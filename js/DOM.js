import { comments } from "./comments.js"
import { API } from "./api.js";


export const DOM = {
    root:        document.querySelector(":root"),
    divApp:      document.getElementById("app"),
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

        if (this.state.waitingAuthor)
            return

        this.gifLoader = document.getElementById("loader")

        if (!this.gifLoader)
            return

        if (show)
            this.gifLoader.classList.remove("hidden")
        else
            this.gifLoader.classList.add("hidden")
    },


    /* listeners */

    handleListenersForSigningLink() {
        const link = document.getElementById("signing-link")

        if (!link)
            return

        link.addEventListener("click", () => {
            this.state.singingAuthor = !this.state.singingAuthor

            this.renderApp()
        })
    },

    handleListenersForToggleSigningPage() {
        const link = document.getElementById("signing-page")

        if (!link)
            return

        link.addEventListener("click", () => {
            if (this.state.singingAuthor) {
                this.state.singingAuthor      = false
                this.state.registrationAuthor = true
            } else if (this.state.registrationAuthor) {
                this.state.singingAuthor      = true
                this.state.registrationAuthor = false
            }

            this.renderApp()
        })
    },

    handleListenersForSigningButton() {
        const button = document.getElementById("sign-button")

        if (!button || !this.state.singingAuthor && !this.state.registrationAuthor)
            return

        const txtName     = document.getElementById("name-input")
        const txtLogin    = document.getElementById("login-input")
        const txtPassword = document.getElementById("password-input")

        const doSign = () => {
            const login    = txtLogin.value.sterilize()
            const password = txtPassword.value.sterilize()

            if (this.state.singingAuthor) {
                return API.signIn(login, password)
            } else if (this.state.registrationAuthor) {
                const name = txtName.value.sterilize()

                return API.signUp(name, login, password)
            }
        }

        button.addEventListener("click", () => {
            doSign()
                .then((data) => {
                    if (data === "error")
                        return data

                    API.username = data.user.name
                    API.token    = data.user.token

                    this.state.singingAuthor      = false
                    this.state.registrationAuthor = false
                    this.state.waitingAuthor      = false

                    comments.getCommentsFromServer()
                })
                .catch(API.handleError)
        })
    },

    handleListenersForAddForm() {
        if (this.state.waitingAuthor)
            return

        this.txtName    = document.getElementById("name-input")
        this.txtQuote   = document.getElementById("quote-input")
        this.txtComment = document.getElementById("comment-input")
        this.boxQuote   = document.getElementById("quote-box")
        this.lblQuote   = document.getElementById("quote-text")
        this.btnCancelQ = document.getElementById("quote-cancel")
        this.btnSubmit  = document.getElementById("comment-add")
        this.btnRemove  = document.getElementById("comment-remove")
        this.gifLoader  = document.getElementById("loader")

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
            let quoteID = this.getValue(this.txtQuote)
            let comment = this.getValue(this.txtComment)

            if (!comment)
                return

            comment = comment.sterilize()

            this.updateLoadingState(true)

            this.txtComment.focus()
            this.btnCancelQ.click()

            this.btnSubmit.disabled = true

            comments.sendCommentToServer(comment)
        })

        this.btnRemove.addEventListener("click", () => {
            if (!comments.deleteLast())
                return

            this.renderApp()
        })

    },

    handleCommentBoxes() {
        if (this.state.waitingAuthor)
            return

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
        if (this.state.waitingAuthor)
            return

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
        if (this.state.waitingAuthor)
            return

        document.querySelectorAll(".like-button").forEach((button) => {
            button.addEventListener("click", (e) => {
                const recordId = button.dataset.id
                comments.updateLikeStatus(recordId)

                e.stopPropagation()

                this.renderApp()
            })
        })
    },


    /* render function */

    renderApp() {
        let parts = []

        if (this.state.singingAuthor) {
            parts.push(`<div class="signing-form">
                <input type="text" id="login-input" class="input" placeholder="Введите ваш логин" value="">
                <input type="password" id="password-input" class="input" placeholder="Введите ваш пароль" value="">
                <div class="row flex">
                    <button id="sign-button" class="button">Авторизоваться</button>
                    <p>Нет аккаунта — <a href="#" class="link" id="signing-page">зарегистрируйтесь</a>.</p>
                </div>
            </div>`)
            parts.push(`<p class="signing-text">Вернуться к <a href="#" class="link" id="signing-link">комментариям</a> в режиме «только просмотр».</p>`)
        } else if (this.state.registrationAuthor) {
            parts.push(`<div class="signing-form">
                <input type="text" id="name-input" class="input" placeholder="Введите ваше имя" value="">
                <input type="text" id="login-input" class="input" placeholder="Введите ваш логин" value="">
                <input type="password" id="password-input" class="input" placeholder="Введите ваш пароль" value="">
                <div class="row flex">
                    <button id="sign-button" class="button">Зарегистрироваться</button>
                    <p>Есть аккаунт — <a href="#" class="link" id="signing-page">авторизуйтесь</a>.</p>
                </div>
            </div>`)
            parts.push(`<p class="signing-text">Вернуться к <a href="#" class="link" id="signing-link">комментариям</a> в режиме «только просмотр».</p>`)
        } else {
            parts.push(`<ul class="comments" id="comment-list">`)
            parts.push(...comments.printListItems())
            parts.push(`</ul>`)

            if (this.state.waitingAuthor) {
                parts.push(`<p class="signing-text">Чтобы отправлять сообщения, пройдите <a href="#" class="link" id="signing-link">авторизацию</a>.</p>`)
            } else if (this.state.sendingNew) {
                parts.push(`<div class="preloaderNew" id="preloaderNew">
                    <span class="loaderNew"></span>
                </div>`)
            } else {
                let defaultName = ""

                if (API.username)
                    defaultName = `value="${API.username}" disabled`

                parts.push(`<div class="add-form">
                    <label class="hidden" for="name-input">Имя:</label>
                    <input class="input input--short" type="text" placeholder="Введите ваше имя" id="name-input" ${defaultName}>
            
                    <label class="hidden" for="quote-input">Цитата:</label>
                    <input class="input input--short hidden" type="text" id="quote-input">
            
                    <div class="comment-editor">
                        <div class="quote flex" id="quote-box">
                            <div class="left" id="quote-text">
                                <!-- vacant -->
                            </div>
                            <button class="cancel-quote-button" id="quote-cancel">&times;</button>
                        </div>
            
                        <label class="hidden" for="comment-input">Комментарий:</label>
                        <textarea class="input input--big" placeholder="Введите ваш коментарий" rows="4" id="comment-input"></textarea>
                    </div>
            
                    <div class="row flex">
                        <button class="button" id="comment-add">Написать</button>
                        <span class="loader hidden" id="loader"></span>
                        <button class="button" id="comment-remove">Удалить последний комментарий</button>
                    </div>
                </div>`)
            }
        }

        this.divApp.innerHTML = parts.join("")

        this.handleListenersForSigningLink()
        this.handleListenersForToggleSigningPage()
        this.handleListenersForSigningButton()
        this.handleListenersForAddForm()

        this.handleCommentBoxes()
        this.handleCommentQuote()
        this.handleLikeButtons()
    },


    /* start working */

    start() {
        if (this.btnSubmit)
            this.btnSubmit.disabled = true

        this.handleListenersForAddForm()

        comments.getCommentsFromServer()
    },
}
