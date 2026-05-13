async function apiGet(action) {
  const response = await fetch(`${API_BASE_URL}?action=${encodeURIComponent(action)}`);
  const text = await response.text();
  const data = JSON.parse(text);
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return data;
}

async function apiPost(payload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  const data = JSON.parse(text);
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return data;
}
