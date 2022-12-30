import React, { useRef } from 'react';
import './style.css';
import { CameraOutline } from 'react-ionicons';
import { IconButton } from '@chakra-ui/react';

export default function BotaoSelectedAvatar({ handlerChoose }) {

    return (
        <>
            <button style={{ borderRadius: 60, backgroundColor: ' #7d7d7d', height: 60, width: 60 }}>
                Upload image
            </button>
            <input type="file" style={{ display: 'none' }} />
        </>
    );
}

{/* <IconButton
onClick={() => handlerChoose()}
style={{ borderRadius: 60, backgroundColor: ' #7d7d7d', height: 60, width: 60 }}
alignSelf={'center'}
colorScheme={'gray'}
aria-label='Search database'
icon={<CameraOutline color={'white'} />}
/> */}