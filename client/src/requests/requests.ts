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
  });

  if (!res.ok) throw new Error("login fail")
  return await res.json()
}