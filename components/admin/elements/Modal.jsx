import React from "react";
import s from "/sass/admin/admin.module.css";

const Modal = ({ isOpen, onClose, render, isConfirm = false }) => {
    return (
        isOpen && (
            <>
                <div className={s.modal_lightbox}>
                    <div className={s.modal_container}>
                        <div className={s.modal_hitbox} onClick={() => onClose()} />
                        {render({ close: onClose })}
                    </div>
                </div>
            </>
        )
    );
};

export default Modal;
