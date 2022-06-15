export const AlertCard = class extends HTMLElement {
    constructor(message, status) {
        super();
        const template = document.querySelector('#alert-temp');
        this.message = message;
        this.appendChild(template.content.cloneNode(true));
        this.container = this.querySelector('[data-alert]');
        this.messageContainer = this.querySelector('[data-message]');
        this.closeBtn = this.querySelector('[data-close]');
        this.classList.add('alert-card');
        
        status
            ? this.container.classList.add('alert-success')
            : this.container.classList.add('alert-danger');
    }

    connectedCallback() {
        this.messageContainer.textContent = this.message;
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.remove();
        });
    }
}

customElements.define('x-alert', AlertCard);