import React from 'react';
import {Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';

const Home: React.FC = () => {
  return (
    <div className='flex justify-center'>
      <h1>Home page</h1>
      <a href="/"className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Button
      </a>
    </div>
    
  )
}

function App() {
  return (
    <div className="App bg-primary">
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
