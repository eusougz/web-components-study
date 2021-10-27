class Tooltip extends HTMLElement {
    constructor() {
        super();
        this._tooltipVisible = false;
        this._tooltipText = 'Some dummy tooltip text :)';
        this.attachShadow({ mode: 'open' });
        this._tooltipIcon;
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    position: absolute;
                    top: 25px;
                    left: 15px;
                    z-index: 10;
                    background-color: #fcfcfc;
                    box-shadow: 1px 1px 10px #0000002f;
                    color: black;
                    padding: 0.5em;
                    border-radius: 6px;
                    font-weight: normal;
                }

                :host {
                    position: relative;
                }
                
                :host(.important) {
                    color: var(--color-primary, red);
                }

                :host-context(p) {
                    font-weight: bold;
                }

                ::slotted(*) {
                    border-bottom: 1px dotted gray;
                }
            </style>

            <slot>Some default text</slot>
            <span> (?)</span>
        `;
    }

    static get observedAttributes() {
        return ['text'];
    }

    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }
        this._tooltipIcon = this.shadowRoot.querySelector('span');
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this.shadowRoot.appendChild(this._tooltipIcon);
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        if (name === 'text') {
            this._tooltipText = newValue;
        }
    }

    disconnectedCallback() {
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() {
        let tooltipContainer;
        if (this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            tooltipContainer = this.shadowRoot.querySelector('div');
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }

    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }

    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }
}

customElements.define('gz-tooltip', Tooltip);
