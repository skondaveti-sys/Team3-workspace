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

export const createOutage = async (data) => {
  const result = validateOutage(data);
  if (!result.ok) return result;
  return Ok(toOutageDto(await outagesRepository.create(result.value)));
};