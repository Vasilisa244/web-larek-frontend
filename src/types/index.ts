export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardList {
	cards: ICard[];
	total: number;
}

export interface IOrderContact {
	email: string;
	phone: string;
}

export interface IOrderPayment {
	payment: 'online' | 'cash';
	address: string;
}

export interface IOrder extends IOrderContact, IOrderPayment {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: ICard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}