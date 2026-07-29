import apiClient from './apiClient';
import { getAccountRecipients } from './accounts';

jest.mock('./apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedGet = apiClient.get as jest.Mock;

describe('dynamic recipient directory', () => {
  beforeEach(() => mockedGet.mockReset());

  test('loads recipients from the authenticated API without fixed account IDs', async () => {
    mockedGet.mockResolvedValue({
      data: [
        { accountNumber: 'ACC-314159', fullName: 'Dynamic Recipient' },
      ],
    });

    await expect(getAccountRecipients()).resolves.toEqual([
      { accountNumber: 'ACC-314159', fullName: 'Dynamic Recipient' },
    ]);
    expect(mockedGet).toHaveBeenCalledWith('/api/accounts/recipients');
  });

  test('fails safe to an empty list for an invalid response shape', async () => {
    mockedGet.mockResolvedValue({ data: { error: 'not a list' } });
    await expect(getAccountRecipients()).resolves.toEqual([]);
  });
});
