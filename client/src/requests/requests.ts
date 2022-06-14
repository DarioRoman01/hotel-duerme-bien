// custom error class for users signup and login requests

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