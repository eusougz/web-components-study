import { newE2EPage } from '@stencil/core/testing';

describe('gz-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gz-spinner></gz-spinner>');

    const element = await page.find('gz-spinner');
    expect(element).toHaveClass('hydrated');
  });
});
