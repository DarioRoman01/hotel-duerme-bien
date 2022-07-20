const url = 'https://haizza.codes/';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

export async function getRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${url}${endpoint}`, {
    credentials: 'include',
    headers: headers,
  })
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err['message']);
  }
  return await response.json();
}

export async function postRequest<T>(body: Object, endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err["message"]);
  }

  return await res.json()
}

// generic function to make a patch request
export async function patchRequest<T>(body: Object, endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err["message"]);
  }

  return await res.json()
}

// generic function to make a delete request
export async function deleteRequest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: "DELETE",
    headers: headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err["message"]);
  }

  return await res.json()
}