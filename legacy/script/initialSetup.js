
window.addEventListener("load", () => {
    // createNewRhythmWithGlobalSettings()

    if (localStorage.previousRhythm) {
        const saveTxt = localStorage.previousRhythm
        loadFromTxt(saveTxt)
    }else {
        loadDefaultSaveFile()
    }
})
