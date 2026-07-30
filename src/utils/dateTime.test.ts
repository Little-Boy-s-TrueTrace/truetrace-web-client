import { apiDate } from './dateTime';

describe('API timestamp normalization', () => {
  test('treats unzoned Spring LocalDateTime values as UTC', () => {
    expect(apiDate('2026-07-29T17:29:30').toISOString())
      .toBe('2026-07-29T17:29:30.000Z');
  });

  test('preserves timestamps that already contain an offset', () => {
    expect(apiDate('2026-07-30T00:29:30+07:00').toISOString())
      .toBe('2026-07-29T17:29:30.000Z');
  });
});
