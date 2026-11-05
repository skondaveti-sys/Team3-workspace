import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/addressesRepository.js', () => ({
  save: jest.fn(),
}));

const repo = await import('../repositories/addressesRepository.js');
const { saveAddresses } = await import('../services/addressesService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

test('saveAddresses rejects an empty starting address', async () => {
  const result = await saveAddresses('', '5 Main St');
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.save).not.toHaveBeenCalled();
});

test('saveAddresses rejects a whitespace-only ending address', async () => {
  const result = await saveAddresses('1 Main St', '   ');
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.save).not.toHaveBeenCalled();
});

test('saveAddresses rejects a starting address over 50 characters', async () => {
  const result = await saveAddresses('a'.repeat(51), '5 Main St');
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.save).not.toHaveBeenCalled();
});

test('saveAddresses rejects an ending address over 50 characters', async () => {
  const result = await saveAddresses('1 Main St', 'a'.repeat(51));
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.save).not.toHaveBeenCalled();
});

test('saveAddresses accepts addresses of exactly 50 characters', async () => {
  const result = await saveAddresses('a'.repeat(50), 'b'.repeat(50));
  expect(result.ok).toBe(true);
  expect(repo.save).toHaveBeenCalledTimes(1);
});

test('saveAddresses saves a valid journey', async () => {
  const result = await saveAddresses('1 Main St', '5 Oak Ave');
  expect(result.ok).toBe(true);
  expect(repo.save).toHaveBeenCalledWith({ start: '1 Main St', end: '5 Oak Ave' });
});