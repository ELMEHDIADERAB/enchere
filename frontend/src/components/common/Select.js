import React from 'react';

function Select({ value, onChange, options, className = '',required=false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border p-2 rounded w-full focus:outline-none ${className}`}
      required={required}
    >
      <option value="" disabled hidden>
         Sélectionner
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
            {option.nomRole ? option.nomRole : option.nomCategorie}
       </option>
      ))}
    </select>
 );
}
export default Select;