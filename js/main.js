import {} from "./prototypes.js"
import { DOM } from "./DOM.js"
import { API } from "./api.js";
import { thumb } from "./thumb.js"


const username = localStorage.getItem("username")
const login    = localStorage.getItem("login")
const token    = localStorage.getItem("token")

if (username && login && token) {
    API.username = username
    API.login    = login
    API.token    = token
}


DOM.start(API.login)
thumb.handleListeners()
