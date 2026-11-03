import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const outageSchema = new mongoose.Schema(
  {
    station: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Outage = mongoose.model('Outage', outageSchema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () => Outage.find().lean();

export const findById = async (id) => Outage.findById(id).lean();

export const create = async (data) => (await Outage.create(data)).toObject();

export const updateById = async (id, data) =>
  Outage.findByIdAndUpdate(id, data, { new: true }).lean();

export const removeById = async (id) => {
  await Outage.findByIdAndDelete(id);
};

// const DATA_DIR = 'data';
// const DATA_FILE = `${DATA_DIR}/outages.json`;

// let queue = Promise.resolve();
// const inOrder = (task) => {
//   const run = queue.then(task);
//   queue = run.catch(() => {});
//   return run;
// };

// const readAll = async () => {
//   try {
//     return JSON.parse(await readFile(DATA_FILE, 'utf-8'));
//   } catch (error) {
//     if (error.code === 'ENOENT') return [];
//     throw error;
//   }
// };

// export const getAll = () => inOrder(readAll);

// export const create = (data) =>
//   inOrder(async () => {
//     const outages = await readAll();
//     const outage = { id: randomUUID(), ...data };
//     outages.push(outage);
//     await mkdir(DATA_DIR, { recursive: true });
//     await writeFile(DATA_FILE, JSON.stringify(outages, null, 2));
//     return outage;
//   });
