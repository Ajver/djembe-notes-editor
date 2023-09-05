document.querySelector('#print-btn').addEventListener('click', () => {
    let divToPrint = document.querySelector('#to-print');

    printDiv(divToPrint);
});

const printDiv = (divToPrint) => {
    let begin = `<html>
        <title>Printing</title>
        <script>
        function step1() {
            setTimeout('step2()', 10);
        }
        function step2() {
            window.print();
            window.close();
        }
        </script>
        <body onload='step1()'>
        <div class='to-print'>
    `;

    let end = "</div></body></html>";

    pagelink = "about:blank";
    let pwa = window.open();
    pwa.document.open(pagelink);
    pwa.document.write(begin + divToPrint.innerHTML + end);
    pwa.document.close();
}
