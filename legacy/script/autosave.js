
window.addEventListener("beforeunload", () => {
    localStorage.previousRhythm = saveToTxt()
})