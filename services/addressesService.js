import { Ok, Err } from "../result.js";
import { save } from "../repositories/addressesRepository.js";

export const saveAddresses = async (startAddress, endAddress) => {
  if (!startAddress.trim() || !endAddress.trim()) {
    return Err({ status: 400, message: "Starting address and ending address are required and can not be empty."})
  }

  if (startAddress.length > 50 || endAddress.length > 50) {
    return Err({ status: 400, message: "Starting address and ending address may not exceed 50 characters, either it's too long or does not exist."})
  }

  const journey = { start: startAddress, end: endAddress};

  await save(journey)

  return Ok(journey)
}
