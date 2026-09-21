import React from 'react';
import {Routes, Route} from "react-router-dom";
import MainLayout from './layout/MainLayout';
import Generator from './pages/Generator';
import Topic from './pages/Topic';
import SavedTopics from './pages/SavedTopics';
import ExperienceCentre from './pages/ExperienceCentre';
import Login from './pages/Login';
import EntryRoute from './routes/EntryRoute';
import "./App.css";


function App() {
  return (
   <>
     <Routes>
      <Route path='/' element={<EntryRoute/>}/>



      <Route element={<MainLayout/>}> {/* This is a layout routing which allows us to call children routes within it*/}

          <Route path='/generator' element={<Generator/>} /> 

          <Route path='/saved-topics' element={<SavedTopics/>} />

          <Route path='/experience-centre' element={<ExperienceCentre/>} />

          <Route path='/topic' element={<Topic/>} />

      </Route>


      <Route path='/login' element={<Login/>} />


     </Routes>
   
   </>
  )
}

export default App