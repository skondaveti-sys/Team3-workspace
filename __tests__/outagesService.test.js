import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/outagesRepository.js', () => ({
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

jest.unstable_mockModule('../dtos/outageDto.js', () => ({
  toOutageDto: jest.fn((outage) => ({ id: 'fake-id', ...outage })),
}));

const repo = await import('../repositories/outagesRepository.js');
const { createOutage, listOutages, deleteOutage } = await import('../services/outagesService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

test('createOutage rejects a missing station', async () => {
  const result = await createOutage({ description: 'No power' });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.create).not.toHaveBeenCalled();
});

test('createOutage rejects a missing description', async () => {
  const result = await createOutage({ station: 'Main St' });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(400);
  expect(repo.create).not.toHaveBeenCalled();
});

test('createOutage rejects whitespace-only fields', async () => {
  const result = await createOutage({ station: '   ', description: '   ' });
  expect(result.ok).toBe(false);
  expect(repo.create).not.toHaveBeenCalled();
});

test('createOutage rejects non-string fields', async () => {
  const result = await createOutage({ station: 42, description: ['x'] });
  expect(result.ok).toBe(false);
  expect(repo.create).not.toHaveBeenCalled();
});

test('createOutage rejects a call with no data at all', async () => {
  const result = await createOutage();
  expect(result.ok).toBe(false);
  expect(repo.create).not.toHaveBeenCalled();
});

test('createOutage trims fields and saves a valid outage', async () => {
  repo.create.mockResolvedValue({ station: 'Main St', description: 'No power' });
  const result = await createOutage({ station: '  Main St ', description: ' No power  ' }, { id: 'user1', role: 'member' });
  expect(result.ok).toBe(true);
  expect(repo.create).toHaveBeenCalledWith({ station: 'Main St', description: 'No power', ownerId: 'user1' });
});

test('listOutages returns what the repository has', async () => {
  repo.getAll.mockResolvedValue([]);
  const result = await listOutages();
  expect(result).toEqual([]);
  expect(repo.getAll).toHaveBeenCalledTimes(1);
});

test('deleteOutage returns 404 when outage does not exist', async () => {
  repo.findById.mockResolvedValue(null);
  const result = await deleteOutage('507f1f77bcf86cd799439011', { id: 'user1', role: 'member' });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
  expect(repo.removeById).not.toHaveBeenCalled();
});

test('deleteOutage rejects non-owner with 403', async () => {
  repo.findById.mockResolvedValue({ ownerId: 'user1' });
  const result = await deleteOutage('507f1f77bcf86cd799439011', { id: 'user2', role: 'member' });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(403);
  expect(repo.removeById).not.toHaveBeenCalled();
});

test('deleteOutage allows the owner', async () => {
  repo.findById.mockResolvedValue({ ownerId: 'user1' });
  const result = await deleteOutage('507f1f77bcf86cd799439011', { id: 'user1', role: 'member' });
  expect(result.ok).toBe(true);
  expect(repo.removeById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
});

test('deleteOutage allows an admin', async () => {
  repo.findById.mockResolvedValue({ ownerId: 'user1' });
  const result = await deleteOutage('507f1f77bcf86cd799439011', { id: 'admin1', role: 'admin' });
  expect(result.ok).toBe(true);
  expect(repo.removeById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
});