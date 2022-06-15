import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';
import { Rooms } from './pages/rooms';
import { Home } from './pages/home';
import { Navbar } from './components/navbar';

const Clients: React.FC = () => {
  return (
    <div className='container'>
      <Navbar />
      <h1>Home page</h1>
        <a href="/"className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Button
        </a>
    </div>
  );
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
