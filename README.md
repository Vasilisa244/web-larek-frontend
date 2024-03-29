# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

### ICard

Интерфейс, который определяет структуру данных для товара. Включает в себя
id - уникальный идентификатор товара
description - описание товара
image - сопровождающее изображение
title - название
category - категория
price - стоимость, 2 варианта - null и number

### IOrderForm

Форма заполнения данных о покупателе содержит данные о доставке и форме оплаты, а так же телефон и почту покупателя.

### IOrder

Основная информация о заказе. Включает интерфейс OrderForm, добавляя к нему данные об общей сумме заказа и массива купленных товаров.

### IOrderResult

Интерфейс успешного оформленного заказа. Имеет в параметрах id (уникальный идентификатор) и общую сумму заказа.

### тип FormErrors

Отвечает за влидацию данных и вывод ошибки. Имеет форму ключ (данные, которые необходимо проверить) - значение (сообщение об ошибках).

### IAppState

Интерфейс, отвечающий за отображение магазина. Включает:
- catalog: ICard[]; - массив товаров в каталоге
- basket: string[]; - массив товаров, добавленных в корзину
- preview: string | null; - отображение одной карточки при ее открытии
- order: IOrder | null; - инеформация о заказе  

### тип ApiListResponse  

Тип используется в ответах от API при возврате списка элементов и их количества.  

## Базовый код

### Абстрактный класс Component< T >  - родительский класс для всех классов слоя VIEW, является дженериком

Принемает в конструктор HTML элемент container. Так же имеет методы:  
- toggleClass - метод переключения класса. Параметрами являются HTML элемент, у которого необходимо установить или удалить значение, само значение ClassName и force, которое указывает на установление или удаление знаечния (необязательный параметр).  
- setText - метод установления текстового содержимого. Парметрами являются HTML элемент и знаечние.  
- setDisabled - метод смены статуса блокировки. Парметрами являются HTML элемент и состояние. Данный метод добавляет или убирает атрибут disabled.  
- setImage - метод установления изображения с алтернативным текстом. Парметрами являются HTML элемент, ссылку на изображение и описание изображения.  
- render - метод возврата корневого DOM-элемента.

### Абстрактный класс Model< T > - родительский класс для всех классов слоя MODEL, является дженериком

Модель данных включает в себя объект данных и событие. Так же имеет метод emitChanges, который оповещает о произошедшем событии.

### Интерфейс IEvents

Имеет 3 метода:  
- on - метод установки обработчика на событие.  
- emit - метод инициирования события с данными.  
- trigger - метод генерации события при вызове.

### Класс EventEmitter

Реализует методы IEvents, а так же имеет методы  
- off - метод снятия обработчика с события.  
- onAll - метод установки слушателя на все события.  
- ofAll - метод снятия всех обработчиков.

### Класс Api

Конструктор класса принемает в параметрах URL запроса и опции.  
Имеет методы:  
- handleResponse - метод обработки ответа от сервера.  
- get - метод для полученая данных от сервера. Параметром является ссылка uri.  
- post - метод для отправкеи данных на сервер. Параметрами являются ссылка uri, объект данных для отправки и см метод POST.

## Отображение

### Класс Card

расширяет абстрактный класс Component. Ищет и присваивает элементы темплейта нужным параметрам. Имеет свойства:

    protected _title: HTMLElement; - название товара
	protected _image: HTMLImageElement; - картинка, которая сопровождает товар
	protected _description: HTMLElement; - описание товара
	protected _button: HTMLButtonElement; - кнопка добавления/удаления из корзины
	protected _price: HTMLElement; - стоимость
	protected _category: HTMLElement; - категория товара
    
Конструктор принемает на вход DOM-элемент и объек, который содержит действия. Так же в конструкторе присваиваются свойствам элементы карточки. 

Имеет методы:  
set id(value: string) - устанавливает id карточки  
get id(): string - получает id карточки  
set title - устанавливает заголовок карточки  
get title(): string - получает заголовок карточки  
set image(value: string) - устанавливает картинку карточки  
set description(value: string | string[]) - устанавливает описание карточки  
set price(value: number | null) - устанавливает стоимость продукта в карточке  
set category(value: string) - устанавливает категорию   
set addToCart(callback: () => void) - устанавливает слушатель  
set buttonText(text: string) - устанавливает текст кнопки

### класс BasketItem

Расширяет класс Card. Отвечает за отображение карточки в корзине. Имеет свойства:

	protected _index: HTMLElement; - номер карточки в корзине
	protected _deleteButton: HTMLButtonElement; - кнопка удаления
	protected _title: HTMLElement; - название
    protected _price: HTMLElement; - стоимость

Конструктор принемает на вход DOM-элемент и объект, который содержит действия. Так же в конструкторе присваиваются свойствам элементы карточки.  
Имеет метод:  
- setIndex(value: number) - устанавливает номер товара в корзине.  

### Класс Form  

расширяет абстрактный класс Component. Отвечает за управление формами, валидацию и отображение ошибок.  
Конструктор принемает на вход DOM-элемент и объект для обработки событий.
Имеет методы:

- onInputChange(field: keyof T, value: string) - эмитирует событие с информацией о поле и его значении.  
- set valid(value: boolean) - метод проверки валидности формы.  
- set errors(value: string) - метод отражения сообщения об ошибке.  
- render(state: Partial<T> & IFormState) - метод отражения состояния формы.  

### Класс OrderContacts

расширяет класс Form. Конструктор включает в себя объект данных и событие. Имеет методы:

- set phone(value: string) - eстанавливает значение поля ввода телефона.
- set email(value: string) - eстанавливает значение поля ввода эл почты.

### Класс OrderPayment 

расширяет класс Form. Конструктор включает в себя объект данных и событие. Имеет свойства:

	protected _cashButton: HTMLButtonElement; - кнопка для оплаты наличными  
    protected _onlineButton: HTMLButtonElement; - кнопка для оплаты онлайн  
    
Конструктор принемает на вход DOM-элемент и событие. Так же в конструкторе присваиваются свойствам соответсвующие кнопки.  

Имеет методы:
- togglePayment(value: HTMLElement) - переключатель кнопки
- cancelPayment() - метод для сброса кнопки  
- set adress(value: string) - устанавливает адрес.

### Класс Page

расширяет абстрактный класс Component. Отвечает за отображение страницы - каталог товаров, корзину, счетчик корзины. Имеет свойства:  

  	protected _counter: HTMLElement; - счетчик товаров в корзине
    protected _catalog: HTMLElement; - каталог товаров
    protected _wrapper: HTMLElement; - сама страница
    protected _basket: HTMLElement; - корзина  
    
Имеет методы:  
- set counter(value: number) - устанавливает значение в счетчике
- set catalog(items: HTMLElement[]) - устанавливает каталог товаров
- set locked(value: boolean)- устанавливает блокировку/ разблокирвоку страницы.  

### Класс Basket

расширяет абстрактный класс Component. Отвечает за отображение состояния корзины. Пользователь может просматривать список товаров, видеть общую сумму товаров, управлять товарами, офромлять заказ.  
Конструктор принемает на вход DOM-элемент и объект для обработки событий.  
Имеет методы:  
- set items(items: HTMLElement[]) - отвечает за отражение списка товаров в корзине.  
- set selected(items: string[]) - отвечает за отображение состоянии корзины и возможности оформления заказа.  
- set total(total: number) - отвечает за отражение общей суммы корзины.

### Класс Modal

расширяет абстрактный класс Component. Отвечает за отображенеи модального окна поверх основного контента.  
Конструктор принемает на вход DOM-элемент и объект для обработки событий. Так же имеются слушатели:

- Обработчик для события click на кнопке закрытия (_closeButton): вызывает метод close(), который закрывает модальное окно.
- Обработчик для события click на контейнер (container): вызывает метод close(), который закрывает модальное окно.
- Обработчик для события click на контенте (_content): запрещает закрытие модального окна при работе с контентом модального окна.

Имеет методы:  
- open() - метод открытия модального окна.  
- close() - метод закрытия модального окна.
- render(data: IModalData): HTMLElement - метод отражения содержимого модальнго окна.

### Класс Success

расширяет абстрактный класс Component. Отвечает за отражение информации при успешном оформлени заказа. Конструктор принемает на вход DOM-элемент и объект для обработки событий.  Имеет метод:  
- set total - устанавливает общую сумму списания при успешном оформлении заказа.  

## Данные

### Класс AppState

расширяет абстрактный класс Model. Отвечает за хранение данных, полученных при работе с приложением. Имеет свойства:  

	basket: ICard[]; - каталог товаров в корзине
    catalog: ICard[]; - каталог товаров, отраженный на странице
    order: IOrder - информация о заказе, включает в себя почту, номер телефона, способ оплаты, адрес, общую цену и товары.
    preview: string | null; - предпросмотр открытой карточки
    formErrors: FormErrors = {}; - ошибки валидации
    
 Имеет методы:  
 - toggleOrderedCard(id: string, isIncluded: boolean) - добавляет или удаляет товары, если они добавлены  
 - setOrderPayment(value: string) - устанавливает способ оплаты  
  - clearBasket() - очистка корзины  
  - itemCount(): number - возвращает количество товаров в корзине  
  - getSelectedItems(): ICard[] - возвращает товары, добаленные в корзину  
  - getTotal() - возвращает общую сумму   
  - setCatalog(items: ICard[]) - установка каталога товаров   
  - setPreview(item: ICard) - установка выбранного товара для предпросмотра  
  - setOrderField(field: keyof IOrderForm, value: string) - метод ддля заполнения полей формы заказа  
  - validateOrder() - валидация формы.  
 

### Класс LarekApi

Расширяет класс Api. В конструкторе принемает cdn, базовый URL, а так же опции (необязательно). Имеет методы:  
- getCard - метод получения карточки.  
- getCardList - метод получения массива карточек.  
- orderProducts - метод отпраки заказа на сервер.  

## Presenter (Cписок событий) 

- events.on < CatalogChangeEvent > ('items:changed') - событие происходит, если изменились элементы каталога. 
- events.on('card:select') - событие происходит при открытии карточки.  
- events.on('preview:changed') - событие происходит, если изменилась выбранная карточка. В нем так же происходит вызов события events.emit('larek:changed') - оно обновлаяет данные в корзине.  
- events.on('basket:open') событие происходит при открытии корзины.  
- events.on('order:open') - событие происходит при открытии формы оплаты и указания адреса.  
- events.on('order:submit') - событие происходит при открытии формы заполения контактных данных.  
- events.on('contacts:submit') - событие происходит при отправки формы заказа.   
- events.on('formErrors:change') - два события, срабатываюих при измениии состояния форм - оплаты и контактов.  
- events.on(/^order\..*:change/) - событие происходит, есди изменилось одно из полей оплаты.  
- events.on(/^contacts\..*:change/) - событие происходит, есди изменилось одно из полей контактов.  
- events.on('order:change payment') - событие происходит при переключении типа оплаты.  
- events.on('modal:open') событие блокирует прокрутку страницы при открытом модальном окне.  
- events.on('modal:close') - событие разблокирует проктрутку страницы при закрытом модальном окне.  
- api.getCardList() - получение карточек с сервера. 
 

