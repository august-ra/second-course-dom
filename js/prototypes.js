
function zeroPad(num, places) {
    return String(num).padStart(places, "0")
}

Date.prototype.print = function (withSeconds = false) {
    const parts = []
    parts.push(zeroPad(this.getDate(), 2))
    parts.push(".")
    parts.push(zeroPad(this.getMonth() + 1, 2))
    parts.push(".")
    parts.push(this.getFullYear().toString().substring(2))
    parts.push(" ")
    parts.push(zeroPad(this.getHours(), 2))
    parts.push(":")
    parts.push(zeroPad(this.getMinutes(), 2))

    if (withSeconds) {
        parts.push(":")
        parts.push(zeroPad(this.getSeconds(), 2))
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
