const form = document.querySelector('#outage-form');
const list = document.querySelector('#outages');
const message = document.querySelector('#form-message');

// Returns the JSON the server answered with. Any failure (no connection,
// timeout, error status) throws an Error whose message is shown to the user.
const fetchJSON = async (url, options) => {
  let response;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
  } catch {
    throw new Error('Could not reach the server.');
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    // Not JSON: the status still says enough.
  }

  if (!response.ok) {
    throw new Error(body.error || `The server answered ${response.status}.`);
  }
  return body;
};

// textContent only, so what someone types is never read as HTML.
const buildItem = (outage) => {
  const item = document.createElement('li');
  item.dataset.id = outage.id;
  const station = document.createElement('strong');
  station.textContent = outage.station;
  item.append(station, `: ${outage.description}`);
  return item;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const outage = {
    station: form.elements.station.value,
    description: form.elements.description.value,
  };

  button.disabled = true;
  message.textContent = '';
  try {
    const saved = await fetchJSON('/outages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outage),
    });
    list.append(buildItem(saved));
    form.reset();
    message.textContent = 'Outage reported.';
  } catch (error) {
    message.textContent = `Your report was not saved. ${error.message}`;
  } finally {
    button.disabled = false;
  }
});