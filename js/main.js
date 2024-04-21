import {} from "./prototypes.js"
import { DOM } from "./DOM.js"
import { API } from "./api.js";
import { thumb } from "./thumb.js"


const username = localStorage.getItem("username")
const token    = localStorage.getItem("token")

if (username && token) {
    API.username = username
    API.token    = token
}


DOM.start(API.username)
thumb.handleListeners()
