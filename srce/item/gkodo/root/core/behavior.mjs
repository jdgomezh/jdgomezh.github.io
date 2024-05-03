class UIComponent extends HTMLElement {
	static observedAttributes = {};

	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		this.$root = this.shadowRoot;

		const baseUrl = new URL('../', import.meta.url);

		Promise.all([
			fetch(`${baseUrl}core/template.html`).then(response => response.text()),
			fetch(`${baseUrl}core/appearance.css`).then(response => response.text())
		])
			.then(([template, style]) => {
				this.render(template, style);
			})
			.catch(error => {
				console.error('Failed to load resources:', error);
				this.shadowRoot.innerHTML = `<p>Error loading the component.</p>`;
			});
	}

	render(template, style) {
		const domParser = new DOMParser();
		const styleElement = document.createElement('style');
		const templateElement = domParser
			.parseFromString(template, 'text/html')
			.querySelector('template');

		styleElement.textContent = style;
		this.$root.appendChild(styleElement);
		this.$root.appendChild(document.importNode(templateElement.content, true));
	}

	toogleItem(item) {
		const attribute = `${item}-open`;
		const current = this.getAttribute(attribute);
		if (current === null) {
			this.setAttribute(attribute, '');
		}
		else {
			this.removeAttribute(attribute);
		}
	}

	toogleHeader() {
		this.toogleItem('header');
	}

	toogleFooter() {
		this.toogleItem('footer');
	}

	toogleNavbar() {
		this.toogleItem('navbar');
	}

	toogleSidebar() {
		this.toogleItem('sidebar');
	}
}

export { UIComponent };
