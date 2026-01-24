const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiGet(params) {
  const url = new URL(BASE_URL);
  Object.keys(params).forEach(k =>
    url.searchParams.append(k, params[k])
  );

  const res = await fetch(url);
  return res.json();
}

export async function apiPost(body) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    //headers: {
    //  "Content-Type": "application/json"
    //},
    body: JSON.stringify(body)
  });
  return res.json();
}
