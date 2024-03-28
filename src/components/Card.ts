import { Component } from './base/Component';
import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
const categoryMap = new Map([
	['софт-скил', 'card__category_soft'],
	['дополнительное', 'card__category_additional'],
	['кнопка', 'card__category_button'],
	['хард-скил', 'card__category_hard'],
	['другое', 'card__category_other'],
]);

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._button = container.querySelector(`.card__button`);
		this._description = container.querySelector(`.card__text`);
		this._price = container.querySelector(`.card__price`);
		this._category = container.querySelector(`.card__category`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryMap.get(value), true);
	}

	set addToCart(callback: () => void) {
		this._button.addEventListener('click', callback);
	}

	set buttonText(text: string) {
		this._button.textContent = text;
	}
}

export class BasketItem extends Card {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

		if (this._deleteButton) {
			this._deleteButton.addEventListener('change', (event: MouseEvent) => {
				actions?.onClick?.(event);
			});
		}
	}
	setIndex(value: number) {
		this.setText(this._index, value);
	}
}
