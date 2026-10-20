import { readFile, writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';

const DATA_DIR = 'data';
const DATA_FILE = `${DATA_DIR}/outages.json`;

export const getAll = async () => {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') return []; // nothing saved yet
    throw error;
  }
};

export const create = async (data) => {
  const outages = await getAll();
  const outage = { id: randomUUID(), ...data };
  outages.push(outage);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(outages, null, 2));
  return outage;
};