import React from 'react';

function Button({ children, onClick, className = '', disabled = false, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;