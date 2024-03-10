interface Card {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
} 

interface CardList {
	cards: Card[];
	total: number;
} 

interface Modal {
	closeModalButton: HTMLButtonElement;
	modalContent: HTMLElement;
	changeModalButton: HTMLButtonElement;
} 

interface Basket {
	items: HTMLElement[];
    total: number;
} 

interface User {
	adress: string;
	email: string;
	phone: number;
} 

interface OrderPayment {
	payType: 'online' | 'cash';
} 

interface IOrderResult {
	id: string;
	total: number;
} 
