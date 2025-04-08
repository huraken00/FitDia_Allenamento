import React from "react";
import "../user/pages/Modal.css";

const Modal = ({ title, message, onConfirm, onCancel, confirmText = "Conferma", cancelText = "Annulla" }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
