import React from 'react';

// Card Component
const Card = ({ title, description, onClick }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        width: '250px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.3s',
      }}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        style={{
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering onClick on the card itself
          onClick();
        }}
      >
        Action
      </button>
    </div>
  );
};

export default Card;
