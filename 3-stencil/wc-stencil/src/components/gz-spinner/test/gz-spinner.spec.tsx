import { newSpecPage } from '@stencil/core/testing';
import { GzSpinner } from '../gz-spinner';

describe('gz-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GzSpinner],
      html: `<gz-spinner></gz-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <gz-spinner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gz-spinner>
    `);
  });
});
