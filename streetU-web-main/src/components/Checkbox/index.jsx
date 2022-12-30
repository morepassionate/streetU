import React from 'react';
import './style.css';

export default function Checkbox({ checked, handleChange }) {
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange} />
                Lembrar senha
            </label>
        </div>
    );
}