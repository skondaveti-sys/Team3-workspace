import { Ok, Err } from "../result.js";
import { save } from "../repositories/addressesRepository.js";

export const saveAddresses = async (startAddress, endAddress) => {
  if (!startAddress || !endAddress) {
    return Err({ status: 400, message: "Starting address and ending address are required."})
  }
  const journey = { start: startAddress, end: endAddress};

  await save(journey)

  return Ok(journey)
}
