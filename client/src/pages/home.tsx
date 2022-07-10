import React from "react";
import { useNavigate } from "react-router-dom";
import { getRequest, User } from "../requests/requests";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const json = localStorage.getItem("currentUser");
  if (!json) navigate('/');
  
  const user: User = JSON.parse(json!);



  // make the logout request to the server
  const logout = () => {
    getRequest<any>('logout')
    .then(_ => {
      localStorage.removeItem('currentUser')
      navigate('/')
    })
    .catch(err => console.log(err))
  }
  
  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center">
      <div className="text-center p-5">
        <p className="text-3xl text-secondary font-bold">Bienvenido {user.username}</p>
      </div>
      <div className="flex flex-col items-center min-w-sreen min-h-80 p-3">
        {user.type === 'gerente' && (
          <>
            <div className="p-5 w-[50%]">
              <button onClick={() => navigate('/rooms')} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                Habitaciones
              </button>
            </div>
            <div className="p-5 w-[50%]">
              <button onClick={() => navigate('/clients')} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                Clientes
              </button>
            </div>
            <div className="p-5 w-[50%]">
              <button onClick={() => navigate('/records')} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                Historial
              </button>
            </div>
            <div className="p-5 w-[50%]">
              <button onClick={() => navigate('/objects')} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                Inventario
              </button>
            </div>
          </>
        )}
        {user.type === 'administrador' && (
          <>
            <div className="p-5 w-[50%]">
              <button onClick={() => navigate('/users')} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
                Usuarios
              </button>
            </div>
          </>
        )}
        <div className="p-5 w-[50%]">
          <button onClick={logout} className=" w-full bg-secondary text-xl hover:bg-secondary text-last font-bold py-2 px-4 rounded">
            salir
          </button>
        </div>
      </div>
    </div>
  )
}