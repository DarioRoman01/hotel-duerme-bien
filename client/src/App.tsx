import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';
import { Rooms } from './pages/rooms';
import { Home } from './pages/home'

const Clients: React.FC = () => {
  return (
    <div>
      <h1>clients page</h1>
      <a href="/rooms" className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">

      </a>
    </div>
  )
}

function App() {
  return (
    <div className="App bg-primary min-h-screen">
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/rooms' element={<Rooms/>}/>
        <Route path='/clients' element={<Clients/>}/>
      </Routes>
    </div>
  );
}

export default App;
