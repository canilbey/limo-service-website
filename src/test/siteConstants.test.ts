import { describe, expect, it } from 'vitest';
import { SITE_EMAIL, SITE_EMAIL_HREF } from '../constants/site';

describe('site constants', () => {
  it('uses the public contact email for mailto and display', () => {
    expect(SITE_EMAIL).toBe('info@budget-limousine.com');
    expect(SITE_EMAIL_HREF).toBe('mailto:info@budget-limousine.com');
  });
});
