import { useReactToPrint } from "react-to-print"

const customStyle = `
.editor-only {
  display: none;
}
html, body {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}
`

export const useStyledReactToPrint = (sheetsContainerRef) => useReactToPrint({
  content: () => sheetsContainerRef.current,
  copyStyles: true,
  pageStyle: customStyle,
})