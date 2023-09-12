
window.addEventListener("beforeunload", () => {
    localStorage.previousRythm = saveToTxt()
})