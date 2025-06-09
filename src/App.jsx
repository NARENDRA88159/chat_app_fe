import { useState } from 'react'

import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Page/Login'
import Signup from './Page/Sign_up'
import { Toaster } from 'react-hot-toast'
import Main from './Page/Main'

function App() {


  return (
    <>
<Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          <Route path="/Home" element={<Main />} />

          </Routes>

        </div>
        <Toaster/>
    </Router>
    </>
  )
}

export default App
