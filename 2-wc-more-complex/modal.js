class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    transition: all 300ms ease-out;
                }

                :host(:not([open])) {
                    opacity: 0;
                    pointer-events: none;
                    transition: all 200ms ease-out;
                }

                :host(:not([open])) #modal {
                    top: 25%;
                }

                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                }

                #modal {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 25rem;
                    border-radius: 6px;
                    background-color: #fcfcfc;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: all 200ms ease-out;
                }

                header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }

                ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }

                .main {
                    padding: 1rem;
                }

                .actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                .actions button {
                    margin: 0 0.25rem;
                }
            </style>

            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <slot name="title"></slot>
                </header>
                <section class="main">
                    <slot></slot>
                </section>
                <section class="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Okay</button>
                </section>
            </div>
        `;
        const backdrop = this.shadowRoot.querySelector('#backdrop');
        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
        backdrop.addEventListener('click', this._cancel.bind(this));
        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));
    }

    open() {
        this.setAttribute('open', '');
        this.isOpen = true;
    }

    hide() {
        if (this.hasAttribute('open')) {
            this.removeAttribute('open');
        }
        this.isOpen = false;
    }

    _cancel(event) {
        this.hide();
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }

    _confirm() {
        this.hide();
        const confirmEvent = new Event('confirm');
        this.dispatchEvent(confirmEvent)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        if (this.hasAttribute('open')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }
}

customElements.define('gz-modal', Modal);
