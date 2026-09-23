import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DMContext } from "../context/DMContext";




function ProtectedRoute({children}) {
  const { user, loading } = useContext(DMContext);

  if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
  
}

export default ProtectedRoute;