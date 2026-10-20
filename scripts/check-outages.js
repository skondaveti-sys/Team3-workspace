
const BASE = 'http://localhost:3000';
let failed = false;

const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failed = true;
};

const post = (station, description) =>
  fetch(`${BASE}/outages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station, description }),
  });

const listedIds = async () => {
  const html = await (await fetch(`${BASE}/outages`)).text();
  return [...html.matchAll(/data-id="([^"]+)"/g)].map((m) => m[1]);
};

const tag = Date.now();

// 1. Single report: saved, and visible after reloading the list.
const single = await post(`Single ${tag}`, 'one report');
const singleBody = await single.json();
check(single.status === 201, 'single report returns 201');
check((await listedIds()).includes(singleBody.id), 'single report appears in the list');

// 2. Two distinct reports at the same time: both must survive.
const [a, b] = await Promise.all([
  post(`Concurrent A ${tag}`, 'first at the same time'),
  post(`Concurrent B ${tag}`, 'second at the same time'),
]);
const aBody = await a.json();
const bBody = await b.json();
check(a.status === 201 && b.status === 201, 'both concurrent reports return 201');
check(aBody.id !== bBody.id, 'the two reports have different ids');
const ids = await listedIds();
check(ids.includes(aBody.id), 'concurrent report A is still in the list');
check(ids.includes(bBody.id), 'concurrent report B is still in the list');
check(ids.includes(singleBody.id), 'the earlier single report is still in the list');

console.log(failed ? '\nSome checks FAILED.' : '\nAll checks passed.');
process.exit(failed ? 1 : 0);