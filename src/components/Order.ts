import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class OrderContacts extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}

export class OrderPayment extends Form<IOrderForm> {
	protected _cashButton: HTMLButtonElement;
	protected _onlineButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._onlineButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
				events.emit(`order:change payment`, {
					payment: this._cashButton.name,
					button: this._cashButton,
				});
			});
		}

		if (this._onlineButton) {
			this._onlineButton.addEventListener('click', () => {
				events.emit(`order:change payment`, {
					payment: this._onlineButton.name,
					button: this._onlineButton,
				});
			});
		}
	}

	togglePayment(value: HTMLElement) {
		this.cancelPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	cancelPayment() {
		this.toggleClass(this._onlineButton, 'button_alt-active', false);
		this.toggleClass(this._cashButton, 'button_alt-active', false);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
