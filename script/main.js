
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

document.querySelector("#import-btn").addEventListener('click', async () => {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile()
    const txtSave = await file.text()
    loadFromTxt(txtSave)
})

document.querySelector("#export-btn").addEventListener('click', async () => {
    const txtSave = saveToTxt()
    const options = {
        types: [
            {
                description: "JSON file",
                accept: { "text/plain": [".json"] },
            },
        ],
        suggestedName: rythmTitle + ".json"
    }
    const newHandle = await window.showSaveFilePicker(options)

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(txtSave);

    // close the file and write the contents to disk.
    await writableStream.close();
})
