export const AlertCard = class extends HTMLElement {
    constructor(message, bool) {
        super();
        this.message = message;
        this.bool = bool
        const temp = document.getElementById('alert-temp');
        this.appendChild(temp.content.cloneNode(true));
        const alertDiv = this.querySelector('[data-alert]');
        if (this.bool) {
            alertDiv.setAttribute('class', 'alert alert-success d-flex align-items-center justify-content-between mb-2 p-1');
        } else {
            alertDiv.setAttribute('class', 'alert alert-danger d-flex align-items-center justify-content-between mb-2 p-1');
        }
    }

    connectedCallback() {
        const message = this.querySelector('[data-message]');
        message.textContent = this.message;
        const closeBtn = this.querySelector('[data-close]');
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.remove();
        });
    }
}

customElements.define('x-alert', AlertCard);