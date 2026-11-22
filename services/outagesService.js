import { Ok, Err } from '../result.js';
import * as outagesRepository from '../repositories/outagesRepository.js';
import { toOutageDto } from '../dtos/outageDto.js';

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const validateOutage = (data = {}) => {
  const station = clean(data.station);
  const description = clean(data.description);
  if (!station || !description) {
    return Err({ status: 400, message: 'Enter both a station and a description of the problem.' });
  }
  return Ok({ station, description });
};

export const listOutages = async () => (await outagesRepository.getAll()).map(toOutageDto);

export const createOutage = async (data, user) => {
  const result = validateOutage(data);
  if (!result.ok) return result;
  return Ok(toOutageDto(await outagesRepository.create({ ...result.value, ownerId: user.id })));
};

const looksLikeId = (id) => typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id);

export const deleteOutage = async (id, user) => {
  if (!looksLikeId(id)) {
    return Err({ status: 404, message: 'That outage report was not found.' });
  }

  const outage = await outagesRepository.findById(id);

  if (!outage) {
    return Err({ status: 404, message: 'That outage report was not found.' });
  }

  const isOwner = outage.ownerId?.toString() === user.id;
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return Err({ status: 403, message: 'You cannot delete this outage report.' });
  }

  await outagesRepository.removeById(id);
  return Ok(null);
};
