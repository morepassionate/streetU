import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Load() {
  return (
    <div>
    <Spinner alignItems={'center'} justifyContent={'center'} marginLeft={'45%'} marginTop={'30%'} color={'white'} size='lg' />
    </div>
  );
}