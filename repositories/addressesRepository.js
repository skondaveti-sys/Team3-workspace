import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () => Address.find().lean();

export const findById = async (id) => Address.findById(id).lean();

export const save = async (data) => (await Address.create(data)).toObject();

export const updateById = async (id, data) =>
  Address.findByIdAndUpdate(id, data, { new: true }).lean();

export const removeById = async (id) => {
  await Address.findByIdAndDelete(id);
};

// export const getAll = async () => {
//   const savedAddresses = await readFile(DATA_FILE, 'utf-8');
//   return JSON.parse(savedAddresses);
// };

// export const save = async (journey) => {
//   const journeys = await getAll();
//   journeys.push(journey);

//   await writeFile(DATA_FILE, JSON.stringify(journey, null, 2));
// };
