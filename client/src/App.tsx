import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';
<<<<<<< HEAD
import { Navbar } from './components/navbar';


=======
import { Rooms } from './pages/rooms';
import { Home } from './pages/home'
>>>>>>> 9d95f0d0e0d017b74c0ba11bc4f771e08ed5146a

const Clients: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className='container'>
      <Navbar />
      <h1>Home page</h1>
        <a href="/"className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Button
        </a>
    </div>
  );
=======
    <div>
      <h1>clients page</h1>
      <a href="/rooms" className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">

      </a>
    </div>
  )
>>>>>>> 9d95f0d0e0d017b74c0ba11bc4f771e08ed5146a
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
