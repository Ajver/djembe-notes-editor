document.querySelector("#print-btn").addEventListener('click', () => {
    let divToPrint = document.querySelector('#to-print');

    printDiv(divToPrint, rythmTitle);
});

const printDiv = (divToPrint, title) => {
    let printContent = `
    <html>
        <title>${title}</title>
        <body onload='step1()'>
            ${divToPrint.outerHTML}
        </body>
        <script>
            function step1() {
                const editorOnlyNodes = document.querySelectorAll(".editor-only")
                console.log(document, editorOnlyNodes)
                editorOnlyNodes.forEach(node => node.remove())
                
                setTimeout('step2()', 10);
            }
            function step2() {
                window.print();
                window.close();
            }
        </script>
    </html>
    `;

    pagelink = "about:blank";
    let pwa = window.open();
    pwa.document.open(pagelink);
    pwa.document.write(printContent);
    pwa.document.close();
}
