export type Room = {
  codigo: number,
  capacidad: number,
  orientacion: string,
  ocupada: boolean,
  estado: string
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

export const getAllRooms = async (): Promise<Array<Room>> => {
  const res = await fetch('http://localhost:5000/rooms')
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err['error'])
  }

  const content =  await res.json()
  return content['rooms']
}