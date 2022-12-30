import React, { useEffect, useState } from 'react';
import './style.css'

export default function Botao({ titleButton, type, handlerSubmit }) {

    return (
        <>
            {type !== 'outline' ?
                <button onClick={() => handlerSubmit()} className='Button'>
                    {titleButton}
                </button>
                :
                <button onClick={() => handlerSubmit()} className='ButtonOutline'>
                    {titleButton}
                </button>
            }
        </>
    );
}