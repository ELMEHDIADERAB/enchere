import React from 'react';

function Input({ type = 'text', value, onChange, placeholder,name, className = '', required = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      className={`border p-2 rounded w-full focus:outline-none ${className}`}
      required={required}
    />
  );
}

export default Input;


