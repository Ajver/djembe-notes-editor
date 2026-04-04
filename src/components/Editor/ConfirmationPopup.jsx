import { useState } from "react";
import ModalWrapper from "./ModalWrapper";


export default function ConfirmationPopup({onConfirm, onCancel, children, visible=true}) {
    const [isVisible, setIsVisible] = useState(visible)

    function hideAndOnConfirm(e) {
        e.preventDefault()
        setIsVisible(false)
        onConfirm()
    }

    function hideAndOnCancel(e) {
        e.preventDefault()
        setIsVisible(false)
        onCancel()
    }

    return (
        <ModalWrapper isVisible={isVisible}>
            <form className="create-rhythm-modal modal" onSubmit={hideAndOnConfirm} onAbort={hideAndOnCancel}>
                {children}
                <div className="buttons-section">
                    <button className="cancel" type="reset" onClick={hideAndOnCancel}>CANCEL</button>
                    <button className="submit" type="submit">CONFIRM</button>
                </div>
            </form>
        </ModalWrapper>
    )
}