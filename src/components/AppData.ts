import _ from 'lodash';
import { Model } from './base/Model';
import { FormErrors, IAppState, ICard, IOrder, IOrderForm } from '../types';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	basket: ICard[];
	catalog: ICard[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: null,
		address: '',
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	toggleOrderedCard(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	setOrderPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			total: 0,
			items: [],
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	itemCount(): number {
		return this.order.items.length;
	}

	getSelectedItems(): ICard[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setCatalog(items: ICard[]) {
		this.catalog = items.map((item) => {
			return {
				id: item.id,
				description: item.description,
				image: item.image,
				title: item.title,
				category: item.category,
				price: item.price,
			};
		});
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		if (field !== 'payment') {
			this.order[field] = value;
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Не указан email';
		}
		if (!this.order.phone) {
			errors.phone = 'Не указан номер телефона';
		}
		if (!this.order.address) {
			errors.address = 'Не указан адрес доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'Не указан способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
