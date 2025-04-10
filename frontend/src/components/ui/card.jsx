import React from 'react';
import styles from './Card.module.css'; // ✅ Import corretto dei CSS module

const Card = ({ title, description, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        className={styles.cardButton}
        onClick={(e) => {
          e.stopPropagation(); // Evita il trigger dell'onClick sulla card
          onClick();
        }}
      >
        Clicca qui!
      </button>
    </div>
  );
};

export default Card;
