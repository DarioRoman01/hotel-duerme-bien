import React from "react";
import { Icon } from "@iconify/react";
import { getCookie } from 'typescript-cookie'

export const Navbar = () => {
  const currentUserType = getCookie('currentUserType');
	const [navbarOpen, setNavbarOpen] = React.useState(false);
  
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-contrast w-full mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className={"lg:flex  items-center" + (navbarOpen ? " flex" : " hidden")} id="example-navbar-danger">
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {currentUserType === 'administrador' && (
                <li className="nav-item">
                  <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" href="/users">
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Usuarios</span>
                  </a>
                </li>
              )}
              {currentUserType === 'gerente' && (<>
                <li className="nav-item">
                  <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" href="/clients">
                    <i className="square text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Clientes</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" href="/rooms">
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Habitaciones</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" href="/records">
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Historial</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-secondary hover:opacity-75" href="/objects">
                    <i className="text-lg leading-lg text-secondary opacity-75"></i><span className="ml-2 font-bold">Inventario</span>
                  </a>
                </li>
              </>)}
            </ul>
          </div>
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-end">
            <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-secondary" href="/home">
              Hotel duerme bien
            </a>
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