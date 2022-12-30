import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AuthNavigation from '../navigations/AuthNavigation';
import SiteNavigation from '../navigations/SiteNavigation';

export default function Rotas() {
    const { usuario } = useContext(UserContext);
    console.log(usuario)
    return (
        <>
            {usuario ? <SiteNavigation /> : <AuthNavigation />}
        </>
    );
}