import React from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { DMContext } from '../context/DMContext';
import { useContext } from 'react';

function EntryRoute() {
    const { user, loading } = useContext(DMContext);

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to="/generator" replace />;
}

export default EntryRoute;