import {} from "./prototypes.js"
import { DOM } from "./DOM.js"
import { API } from "./api.js";
import { thumb } from "./thumb.js"


API.readSigningData()

DOM.start(API.login)
thumb.handleListeners()
