import React from "react";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen min-w-screen">
      <div className="flex justify-between min-w-sreen p-3">
        <div>
          <a href="/rooms" className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
            rooms
          </a>
        </div>
        <div>
          <a href="/clients" className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
            clients
          </a>
        </div>
        <div>
          <a href="/records" className="bg-secondary hover:bg-secondary text-last font-bold py-2 px-4 rounded">
            history
          </a>
        </div>
      </div>
    </div>
  )
}