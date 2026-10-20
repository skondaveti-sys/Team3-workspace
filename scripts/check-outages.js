const post = (station, description) =>
  fetch('http://localhost:3000/outages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station, description }),
  });


const pageText = async () => {
  const response = await fetch('http://localhost:3000/outages');
  return response.text();
};

const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
};

const single = await post('Single report', 'one report');
const singleReport = await single.json();
check(single.status === 201, 'single report returns 201');
check((await pageText()).includes(singleReport.id), 'single report appears in the list');


const firstRequest = post('Concurrent A', 'first at the same time');
const secondRequest = post('Concurrent B', 'second at the same time');
const first = await firstRequest;
const second = await secondRequest;
const firstReport = await first.json();
const secondReport = await second.json();

check(first.status === 201 && second.status === 201, 'both concurrent reports return 201');
check(firstReport.id !== secondReport.id, 'the two reports have different ids');

const page = await pageText();
check(page.includes(firstReport.id), 'concurrent report A is still in the list');
check(page.includes(secondReport.id), 'concurrent report B is still in the list');
check(page.includes(singleReport.id), 'the earlier single report is still in the list');