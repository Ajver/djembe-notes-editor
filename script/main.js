
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

document.querySelector("#submit-export-rythm-btn").addEventListener("click", () => {
    document.querySelector("#export-modal-wrapper").classList.remove("modal-visible")
})

document.querySelector("#export-file-name-input").addEventListener("change", (event) => {
    let exportFileName = document.querySelector("#export-file-name-input").value

    if (!exportFileName.endsWith(".json")) {
        exportFileName += ".json"
    }

    const exportBtn = document.querySelector("#submit-export-rythm-btn")
    exportBtn.download = exportFileName
})

document.querySelector("#export-btn").addEventListener("click", async () => {
    // Show modal
    document.querySelector("#export-modal-wrapper").classList.add("modal-visible")
    
    document.querySelector("#export-file-name-input").value = rythmTitle

    const txtSave = saveToTxt()

    const myBlob = new Blob([txtSave], {type: "application/json"});

    const url = window.URL.createObjectURL(myBlob);
    const exportBtn = document.querySelector("#submit-export-rythm-btn")
    exportBtn.href = url;
    exportBtn.download = rythmTitle + ".json";
})

document.querySelector("#close-export-rythm-modal-btn").addEventListener("click", () => {
    document.querySelector("#export-modal-wrapper").classList.remove("modal-visible")
})