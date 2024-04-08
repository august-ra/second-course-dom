
const lstComments = document.getElementById("comment-list")

let counter = -1

const timerId =  setInterval(() => {
    ++counter

    const dots = (() => {
        const cnt = counter % 3 + 1
        const leftPart = "".padEnd(cnt, ".")

        if (cnt === 3)
            return leftPart
        else
            return `${leftPart}<span style="opacity: 0">${"".padEnd(3 - cnt, ".")}</span>`
    })()

    const text = (() => {
        if (counter < 9)
            return "Пожалуйста, подождите, идёт первая загрузка"
        else
            return "Загрузка идёт слишком долго, но, пожалуйста, подождите ещё"
    })()

    lstComments.innerHTML = `<li>${text}${dots}</li>`
}, 400)

export function clearIntroducer() {
    clearInterval(timerId)

    // dispose the function for next times
    clearIntroducer = function () {}
}
