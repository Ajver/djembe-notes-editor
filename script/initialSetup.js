
window.addEventListener("load", () => {
    // createNewRythmWithGlobalSettings()

    if (localStorage.previousRythm) {
        const saveTxt = localStorage.previousRythm
        loadFromTxt(saveTxt)
    }else {
        loadDefaultSaveFile()
    }
})
