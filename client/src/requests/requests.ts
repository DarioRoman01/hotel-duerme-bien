export type Room = {
  codigo: number,
  capacidad: number,
  orientacion: string,
  ocupada: boolean,
  estado: string
}

export type Client = {
  rut: string,
  nombre: string,
  reputacion: number,
  habitacion: string,
}

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

export const loginUSer = async (username: string, pwd: string) => {
  const res = await fetch('http://localhost:5000/login', {
    method: "post",
    body: JSON.stringify({
      "username": username,
      "password": pwd
    }),
    headers: headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err["error"]);
  }

  return await res.json()
}

// api is a generic function to make get requests
export async function api<T>(endpoint: string): Promise<T> {
  const response = await fetch('http://localhost:5000'+endpoint, {
    credentials: 'include',
    headers: headers,
  })
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err['error'])
  }
  return await response.json();
}