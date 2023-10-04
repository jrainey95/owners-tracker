import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../components/Home/Index';
import Layout from '../components/Layout/Index';
import Owners from '../components/Owners/Index';

import './App.scss'
import DolphinOwners from '../components/DolphinOwner/Index';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" activeclassname="active" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/owners" activeclassname="active" element={<Owners />} />
          <Route path="/owners/godolphin" activeclassname="active" element={<DolphinOwners />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
