import React from 'react';
import './card.css';

const Card = ({ title, description, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        className="card-button"
        onClick={(e) => {
          e.stopPropagation(); // Evita il trigger dell'onClick sulla card
          onClick();
        }}
      >
        Action
      </button>
    </div>
  );
};

export default Card;
