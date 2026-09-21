import React from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Generator from '../pages/Generator';
import { DMContext } from '../context/DMContext';
import { useContext } from 'react';

function EntryRoute() {
    const {isLoggedIn, setIsLoggedIn} = useContext(DMContext);


        if(isLoggedIn !== true){
            return <Navigate to="/login" replace /> 
        }


  return (
    <Navigate to="/generator" replace />
  )
}

export default EntryRoute;