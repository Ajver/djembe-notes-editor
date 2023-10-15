
document.querySelector("#tips-panel-hide-btn").addEventListener("click", () => {
    const tipsPanel = document.querySelector("#tips-panel")
    const btn = document.querySelector("#tips-panel-hide-btn")

    if (tipsPanel.classList.contains("hidden")) {
        // Show the hidden
        tipsPanel.classList.remove("hidden")
        btn.innerHTML = "HIDE"
    }else {
        // Hide the shown
        tipsPanel.classList.add("hidden")
        btn.innerHTML = "SHOW"
    }
})

document.querySelector("#import-btn").addEventListener('change', async (event) => {
    const [file] = document.querySelector("#import-btn").files
    
    if (!file) {
        return
    }

    const txtSave = await file.text()
    loadFromTxt(txtSave)
})

document.querySelector("#submit-export-rhythm-btn").addEventListener("click", () => {
    document.querySelector("#export-modal-wrapper").classList.remove("modal-visible")
    document.querySelector("body").classList.remove("modal-visible")
})

document.querySelector("#close-export-rhythm-modal-btn").addEventListener("click", () => {
    document.querySelector("#export-modal-wrapper").classList.remove("modal-visible")
    document.querySelector("body").classList.remove("modal-visible")
})

document.querySelector("#export-file-name-input").addEventListener("change", (event) => {
    const input = document.querySelector("#export-file-name-input")
    let exportFileName = input.value

    if (exportFileName === "") {
        exportFileName = rhythmTitle
        input.value = exportFileName
    }

    if (!exportFileName.endsWith(".json")) {
        exportFileName += ".json"
    }

    const exportBtn = document.querySelector("#submit-export-rhythm-btn")
    exportBtn.download = exportFileName
})

document.querySelector("#export-btn").addEventListener("click", async () => {
    // Show modal
    document.querySelector("#export-modal-wrapper").classList.add("modal-visible")
    document.querySelector("body").classList.add("modal-visible")
    
    document.querySelector("#export-file-name-input").value = rhythmTitle

    const txtSave = saveToTxt()

    const myBlob = new Blob([txtSave], {type: "application/json"});

    const url = window.URL.createObjectURL(myBlob);
    const exportBtn = document.querySelector("#submit-export-rhythm-btn")
    exportBtn.href = url;
    exportBtn.download = rhythmTitle + ".json";
})
