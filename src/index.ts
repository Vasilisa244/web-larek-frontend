import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ICard, IOrderForm } from './types';
import { OrderContacts, OrderPayment } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsOrderTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderContacts = new OrderContacts(
	cloneTemplate(contactsOrderTemplate),
	events
);
const orderPayment = new OrderPayment(
	cloneTemplate(paymentOrderTemplate),
	events
);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть карточку
events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// Изменена открытая карточка
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate));
	card.addToCart = () => {
		appData.toggleOrderedCard(item.id, true);
		card.buttonText = 'Удалить';
		modal.close();
		events.emit('larek:changed');
	};

	if (appData.order.items.includes(item.id)) {
		card.buttonText = 'Удалить';
		card.addToCart = () => {
			appData.toggleOrderedCard(item.id, false);
			card.buttonText = 'В корзину';
			modal.close();
			events.emit('larek:changed');
		};
	}
	modal.render({
		content: card.render({
			id: item.id,
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		}),
	});
});

// открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открыть форму оплпты
events.on('order:open', () => {
	modal.render({
		content: orderPayment.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					events.emit('larek:changed');
					basket.selected = appData.getTotal();
				},
			});
			events.emit('larek:changed');
			appData.clearBasket();
			basket.selected = appData.getTotal();
			modal.render({
				content: success.render({ total: result.total }),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	orderContacts.valid = !email && !phone;
	orderContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	orderPayment.valid = !payment && !address;
	orderPayment.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

//изменилось один из контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Переключение вида оплаты товара
events.on(
	'order:change payment',
	(data: { payment: string; button: HTMLElement }) => {
		appData.setOrderPayment(data.payment);
		orderPayment.togglePayment(data.button);
		appData.validateOrder();
	}
);

// обновление корзины
events.on('larek:changed', () => {
	page.counter = appData.itemCount();
	basket.total = appData.getTotal();
	basket.items = appData.getSelectedItems().map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.toggleOrderedCard(item.id, false);
				page.counter = appData.itemCount();
				basket.total = appData.getTotal();
				basket.selected = appData.getTotal();
				appData.total = appData.getTotal();

				events.emit('larek:changed');
			},
		});
		card.setIndex(index + 1);
		appData.total = appData.getTotal();
		basket.selected = appData.getTotal();
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
