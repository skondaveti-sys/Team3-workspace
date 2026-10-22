import * as addressesService from '../services/addressesService.js';

export const index = async (req, res) => {
  res.status(200).render('addresses', { title: "Search your Desired Route"});
};

export const create = async (req, res) => {
  const { startAddress, endAddress } = req.body;

  if (typeof startAddress !== 'string' || typeof endAddress !== 'string') {
      return Err({ status: 400, message: "Starting address and ending address have to be strings, coordinates are not accepted."})
    }

  const result = await addressesService.saveAddresses(startAddress, endAddress);

  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }

  res.status(200).json(result.value)
};
