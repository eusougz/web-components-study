class ConfirmLink extends HTMLAnchorElement {
    connectedCallback() {
        this.addEventListener('click', event => {
            if (!confirm('DDo you really want to leave?')) {
                event.preventDefault();
            }
        })
    }
}

customElements.define('gz-confirm-link', ConfirmLink, { extends: 'a' });
