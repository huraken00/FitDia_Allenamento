import React from "react";
import styles from "./Modal.module.css"; // Importa il modulo CSS

const Modal = ({ title, message, onConfirm, onCancel, confirmText = "Conferma", cancelText = "Annulla" }) => {
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles["modal-buttons"]}>
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
