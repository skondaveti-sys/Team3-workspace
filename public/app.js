// Handles the start/end address form on /addresses.
// Submits in the background with fetch, then shows the result or the error
// in the #message area (an aria-live region, so screen readers announce it).

const form = document.getElementById('address-form');
const message = document.getElementById('message');

function showMessage(text, isError) {
  message.replaceChildren();
  const p = document.createElement('p');
  p.className = isError ? 'error' : 'success';
  p.textContent = text;
  message.appendChild(p);
}

if (form && message) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const startAddress = form.elements.startAddress.value;
    const endAddress = form.elements.endAddress.value;

    try {
      const response = await fetch('/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAddress, endAddress }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        // The server sent something that was not JSON; fall through to the status message.
      }

      if (!response.ok) {
        showMessage(
          data.error || `The server refused the request (status ${response.status}).`,
          true
        );
        return;
      }

      showMessage(`Saved your route from ${data.start} to ${data.end}.`, false);
      form.reset();
    } catch (networkError) {
      showMessage('Could not reach the server. Check your connection and try again.', true);
    }
  });
}
