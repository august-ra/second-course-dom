"use strict"


const root     = document.querySelector(":root")
const lblLeft  = document.getElementById("cute-mode")
const lblRight = document.getElementById("devil-mode")
const btnSlot  = document.getElementById("slot-button")
const btnArm   = document.getElementById("arm-button")
const buttons = [btnSlot, btnArm]

let times = 0


let activateLeft = function () {
     lblLeft.classList.add("mode-active")
    lblRight.classList.remove("mode-active")
      btnArm.classList.remove("arm-changed")

    // set usual colors
    root.style.setProperty("--scroll",       "var(--pear)")
    root.style.setProperty("--active",       "var(--pear)")
    root.style.setProperty("--disabled",     "gray")
    root.style.setProperty("--mine",         "var(--green)")
    root.style.setProperty("--others",       "var(--purple)")
    root.style.setProperty("--heart-empty",  `url("./img/heart-empty.svg")`)
    root.style.setProperty("--heart-filled", `url("./img/heart-filled.svg")`)

    showEnoughTimes()
}

let activateRight = function () {
     lblLeft.classList.remove("mode-active")
    lblRight.classList.add("mode-active")
      btnArm.classList.add("arm-changed")

    // set unusual colors
    root.style.setProperty("--scroll",       "var(--red)")
    root.style.setProperty("--active",       "#ec3030")
    root.style.setProperty("--disabled",     "#9a4242")
    root.style.setProperty("--mine",         "#ec7630")
    root.style.setProperty("--others",       "var(--red)")
    root.style.setProperty("--heart-empty",  `url("./img/heart-devil-empty.svg")`)
    root.style.setProperty("--heart-filled", `url("./img/heart-devil-filled.svg")`)

    showEnoughTimes()
}

function showEnoughTimes() {
    ++times

    if (times < 3)
        return

    btnArm.classList.add("arm--broken")

    activateLeft = function () {}
    activateRight = function () {}

    console.error("Доигрался. Сломал ручку переключателя. Молодцом!")
}


lblLeft.addEventListener("click", () => {
    if (lblRight.classList.contains("mode-active"))
        activateLeft()
})

lblRight.addEventListener("click", () => {
    if (lblLeft.classList.contains("mode-active"))
        activateRight()
})

buttons.forEach(
    (button) => button.addEventListener("click", () => {
        if (lblRight.classList.contains("mode-active"))
            activateLeft()
        else
            activateRight()
    })
)
