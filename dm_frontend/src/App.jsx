import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from './layout/MainLayout';
import Generator from './pages/Generator';
import Topic from './pages/Topic';
import SavedTopics from './pages/SavedTopics';
import ExperienceCentre from './pages/ExperienceCentre';
import Login from './pages/Login';
import EntryRoute from './routes/EntryRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import "./App.css";
import AccountDetails from './pages/AccountDetails';
import Register from './pages/Register';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExperienceChat from './pages/ExperienceChat';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};



function App() {
  return (
    <>
    <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<EntryRoute />} />

        <Route element={<MainLayout />}>
          <Route path='/generator' element={<ProtectedRoute><Generator /></ProtectedRoute>} />
          <Route path='/saved-topics' element={<ProtectedRoute><SavedTopics /></ProtectedRoute>} />
          <Route path='/experience-centre' element={<ProtectedRoute><ExperienceCentre /></ProtectedRoute>} />
          <Route path='/topic/:topicId' element={<ProtectedRoute><Topic /></ProtectedRoute>} />
          <Route path='/account-details' element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
          <Route path='/experience/:conversationId' element={<ProtectedRoute><ExperienceChat/></ProtectedRoute>} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App;