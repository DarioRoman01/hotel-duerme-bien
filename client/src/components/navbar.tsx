import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { User } from "../requests/requests";

export const Navbar = () => {
  const navigate = useNavigate()
  const json = localStorage.getItem("currentUser");
  if (!json) navigate('/');
  
  const user: User = JSON.parse(json!);

	const [navbarOpen, setNavbarOpen] = React.useState(false);
  
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-contrast w-full mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className={"lg:flex  items-center" + (navbarOpen ? " flex" : " hidden")} id="example-navbar-danger">
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {user.type === 'administrador' && (
                <li className="nav-item">
                  <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" onClick={() => navigate("/users")}>
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Usuarios</span>
                  </button>
                </li>
              )}
              {user.type === 'gerente' && (<>
                <li className="nav-item">
                  <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" onClick={() => navigate("/clients")}>
                    <i className="square text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Clientes</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" onClick={() => navigate("/rooms")}>
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Habitaciones</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" onClick={() => navigate("/records")}>
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Historial</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" onClick={() => navigate("/objects")}>
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Inventario</span>
                  </button>
                </li>
              </>)}
            </ul>
          </div>
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-end">
            <button className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-secondary" onClick={() => navigate("/home")}>
              Hotel duerme bien
            </button>
            <button
              className="text-secondary cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <Icon icon='fa:bars'/>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}