export const AlertCard = class extends HTMLElement {
    constructor(message, status) {
        super();
        this.message = message;
        const temp = document.getElementById('alert-temp');
        this.appendChild(temp.content.cloneNode(true));
        const alertDiv = this.querySelector('[data-alert]');
        
        status
        ? alertDiv.classList.add('alert-success')
        : alertDiv.classList.add('alert-danger');
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