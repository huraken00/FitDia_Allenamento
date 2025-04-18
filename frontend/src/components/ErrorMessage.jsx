// components/Error.js
import React from 'react';

import styles from './ErrorMessage.module.css'; // crea anche il relativo CSS

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className={styles.alert}>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
