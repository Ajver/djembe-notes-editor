
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