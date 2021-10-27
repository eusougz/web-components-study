import { Component, h, Method, Prop, State } from "@stencil/core";

@Component({
  tag: 'gz-side-drawer',
  styleUrl: './gz-side-drawer.css',
  shadow: true
})
export class SideDrawer {
  @State()
  showContactInfo: boolean;

  @Prop({ reflect: true })
  title: string;

  @Prop({ reflect: true, mutable: true })
  opened: boolean;

  @Method()
  async open(): Promise<void> {
    this.opened = true;
  }

  onCloseDrawer() {
    this.opened = false;
  }

  onContentChange(content: string) {
    this.showContactInfo = content === 'contact';
  }

  render() {
    let mainContent;
    if (this.showContactInfo) {
      mainContent = (
        <div>
          <h2>Contact information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 0339992133</li>
            <li>Email: <a href="http://google.om">test@email.com</a></li>
          </ul>
        </div>
      )
    } else {
      mainContent = <slot />;
    }

    return [
      <div class="backdrop" onClick={() => this.onCloseDrawer()} />,
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={() => this.onCloseDrawer()}>Close</button>
        </header>
        <section class="tabs">
          <button
            class={!this.showContactInfo && "active"}
            onClick={() => this.onContentChange('nav')}
          >
            Navigation
          </button>
          <button
            class={this.showContactInfo && "active"}
            onClick={() => this.onContentChange('contact')}
          >
            Contact
          </button>
        </section>
        <main>
          {mainContent}
        </main>
      </aside>
    ];
  }
}
