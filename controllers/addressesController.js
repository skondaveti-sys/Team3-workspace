import * as addressesService from '../services/addressesService.js';

export const index = async (req, res) => {
  res.status(200).render('addresses', { title: "Search your Desired Route"});
};

export const create = async (req, res) => {
  const { startAddress, endAddress } = req.body;

  const result = await addressesService.saveAddresses(startAddress, endAddress);

  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }

  res.status(200).json(result.value)
};
