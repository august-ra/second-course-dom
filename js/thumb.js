
export const thumb = {
    root: document.querySelector(":root"),
    lblLeft: document.getElementById("cute-mode"),
    lblRight: document.getElementById("devil-mode"),
    btnSlot: document.getElementById("slot-button"),
    btnArm: document.getElementById("arm-button"),

    times: 0,


    activateLeft() {
        this.lblLeft.classList.add("mode-active")
        this.lblRight.classList.remove("mode-active")
        this.btnArm.classList.remove("arm-changed")

        // set usual colors
        this.root.style.setProperty("--shadow", "var(--back)")
        this.root.style.setProperty("--scroll", "var(--pear)")
        this.root.style.setProperty("--active", "var(--pear)")
        this.root.style.setProperty("--disabled", "gray")
        this.root.style.setProperty("--mine", "var(--green)")
        this.root.style.setProperty("--others", "var(--purple)")
        this.root.style.setProperty("--heart-empty", `url("./img/heart-standard-empty.svg")`)
        this.root.style.setProperty("--heart-filled", `url("./img/heart-standard-filled.svg")`)

        this.showEnoughTimes()
    },

    activateRight() {
        this.lblLeft.classList.remove("mode-active")
        this.lblRight.classList.add("mode-active")
        this.btnArm.classList.add("arm-changed")

        // set unusual colors
        this.root.style.setProperty("--shadow", "#f00")
        this.root.style.setProperty("--scroll", "var(--red)")
        this.root.style.setProperty("--active", "#ec3030")
        this.root.style.setProperty("--disabled", "#9a4242")
        this.root.style.setProperty("--mine", "#ec7630")
        this.root.style.setProperty("--others", "var(--red)")
        this.root.style.setProperty("--heart-empty", `url("./img/heart-devil-empty.svg")`)
        this.root.style.setProperty("--heart-filled", `url("./img/heart-devil-filled.svg")`)

        this.showEnoughTimes()
    },

    showEnoughTimes() {
        ++this.times

        if (this.times < 3)
            return

        this.btnArm.classList.add("arm--broken")

        this.activateLeft = function () {}
        this.activateRight = function () {}

        console.error("Доигрался. Сломал ручку переключателя. Молодцом!")
    },


    handleListeners() {
        this.lblLeft.addEventListener("click", () => {
            if (this.lblRight.classList.contains("mode-active"))
                this.activateLeft()
        })

        this.lblRight.addEventListener("click", () => {
            if (this.lblLeft.classList.contains("mode-active"))
                this.activateRight()
        })

        const buttons = [this.btnSlot, this.btnArm]
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                if (this.lblRight.classList.contains("mode-active"))
                    this.activateLeft()
                else
                    this.activateRight()
            })
        })
    },
}
