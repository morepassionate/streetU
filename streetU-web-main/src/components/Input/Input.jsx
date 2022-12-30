import React from 'react';
import './style.css';

export default function Input({type, valor, setValor, placeholder}) {
    return (
        <input
            className='Input'
            type={type} 
            placeholder={placeholder} />
    )
}