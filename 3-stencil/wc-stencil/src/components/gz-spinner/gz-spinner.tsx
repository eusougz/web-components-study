import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'gz-spinner',
  styleUrl: 'gz-spinner.css',
  shadow: true,
})
export class GzSpinner {

  render() {
    return (
      <Host>
        <p>Loading...</p>
      </Host>
    );
  }

}
