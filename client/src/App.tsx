import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';
import { Rooms } from './pages/rooms';
import { Home } from './pages/home';
import { Clients } from './pages/clients'
import { Records } from './pages/records'
import { Objects } from './pages/objects'
import { Users } from './pages/users';


function App() {
  return (
    <div className="App bg-primary min-h-screen">
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/rooms' element={<Rooms/>}/>
        <Route path='/clients' element={<Clients/>}/>
        <Route path='/records' element={<Records />}/>
        <Route path='/objects' element={<Objects />}/>
        <Route path='/users' element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;
