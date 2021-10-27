class MoreInfo extends HTMLElement {
    constructor() {
        super();
        this._isHidden = true;
        
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #info-box {
                    display: none;
                }
            </style>

            <button>Show</button>
            <p id="info-box">
                <slot></slot>
            </p>
        `;

        this._infoEl = this.shadowRoot.querySelector('#info-box');
        this._buttonEl = this.shadowRoot.querySelector('button');
        this._buttonEl.addEventListener('click', this._toggleInfoBox.bind(this));
    }

    connectedCallback() {
        if (this.hasAttribute('is-visible')) {
            if (this.getAttribute('is-visible') === 'true') {
                this._isHidden = false;
                this._infoEl.style.display = 'block';
                this._buttonEl.textContent = 'Hide';
            }
        }
    }

    _toggleInfoBox() {
        if (this._isHidden) {
            this._infoEl.style.display = 'block';
            this._buttonEl.textContent = 'Hide';
            this._isHidden = false;
        } else {
            this._infoEl.style.display = 'none';
            this._buttonEl.textContent = 'Show';
            this._isHidden = true;
        }
    }
}

customElements.define('gz-more-info', MoreInfo);
