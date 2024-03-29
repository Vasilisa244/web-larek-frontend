export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	email: string;
	phone: string;
	payment: string;
	address: string;
}

export interface IOrder extends IOrderForm {
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

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};
