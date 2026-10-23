import { readFile, writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';

const DATA_DIR = 'data';
const DATA_FILE = `${DATA_DIR}/outages.json`;


let queue = Promise.resolve();
const inOrder = (task) => {
  const run = queue.then(task);
  queue = run.catch(() => {}); 
  return run;
};

const readAll = async () => {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') return []; 
    throw error;
  }
};

export const getAll = () => inOrder(readAll);

export const create = (data) =>
  inOrder(async () => {
    const outages = await readAll();
    const outage = { id: randomUUID(), ...data };
    outages.push(outage);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(outages, null, 2));
    return outage;
  });