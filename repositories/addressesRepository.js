import { readFile, writeFile } from 'fs/promises';

const DATA_FILE = 'addresses.json';

export const getAll = async () => {
  const savedAddresses = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(savedAddresses);
};

export const save = async (journey) => {
  await writeFile(DATA_FILE, JSON.stringify(journey, null, 2));
};
