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
price - цена

### ICardList

Интерфейс, который выводит массив товаров (Card). Так же имеет параметр общего кол-ва полученных карточек товара (total).

### IBasket

Интерфейс корзины. Включает в себя массив товаров в орзине и параметр, определяющий общую сумму.

### IOrderContact

Форма заполнения данных о покупателе содержит телефон и почту покупателя.

### IOrderPayment

Форма заполнения данных о доставке и оплате. Включает в себя тип оплаты и адрес доставки.

### IOrder

Основная информация о заказе. Включает интерфейс OrderContact и OrderPayment, добавляя к нему данные об общей сумме заказа и массива купленных товаров.

### IOrderResult

Интерфейс успешного оформленного заказа. Имеет в параметрах id (уникальный идентификатор) и общую сумму заказа.

## Базовый код

### Абстрактный класс Component - родительский класс для всех классов слоя VIEW

Принемает в конструктор HTML элемент container. Так же имеет методы:  
- toggleClass - метод переключения класса. Параметрами являются HTML элемент, у которого необходимо установить или удалить значение, само значение ClassName и force, которое указывает на установление или удаление знаечния (необязательный параметр).  
- setText - метод установления текстового содержимого. Парметрами являются HTML элемент и знаечние.  
- setDisabled - метод смены статуса блокировки. Парметрами являются HTML элемент и состояние. Данный метод добавляет или убирает атрибут disabled.  
- setImage - метод установления изображения с алтернативным текстом. Парметрами являются HTML элемент, ссылку на изображение и описание изображения.  
- render - метод возврата корневого DOM-элемента.

### Абстрактный класс Model - родительский класс для всех классов слоя MODEL

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

расширяет абстрактный класс Component. Ищет и присваивает элементы темплейта нужным параметрам.

### Класс Order

расширяет класс Form.

### Класс Page

расширяет абстрактный класс Component. Отвечает за отображение страницы - каталог товаров, корзину, счетчик корзины.

### Класс Basket

расширяет абстрактный класс Component. Отвечает за отображение состояния корзины. Пользователь может просматривать список товаров, видеть общую сумму товаров, управлять товарами, офромлять заказ.  
Конструктор принемает на вход DOM-элемент и объект для обработки событий.  
Имеет методы:  
- set items(items: HTMLElement[]) - отвечает за отражение списка товаров в корзине.  
- set selected(items: string[]) - отвечает за отображение состоянии корзины и возможности оформления заказа.  
- set total(total: number) - отвечает за отражение общей суммы корзины.

### Класс Form

расширяет абстрактный класс Component. Отвечает за управление формами, валидацию и отображение ошибок.  
Конструктор принемает на вход DOM-элемент и объект для обработки событий.
Имеет методы:

- onInputChange(field: keyof T, value: string) - эмитирует событие с информацией о поле и его значении.  
- set valid(value: boolean) - метод проверки валидности формы.  
- set errors(value: string) - метод отражения сообщения об ошибке.  
- render(state: Partial<T> & IFormState) - метод отражения состояния формы.

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

расширяет абстрактный класс Component. Отвечает за отражение информации при успешном оформлени заказа. Конструктор принемает на вход DOM-элемент и объект для обработки событий. 

## Данные

### Класс AppState

расширяет абстрактный класс Model. Отвечает за хранение данных, полученных при работе с приложением.  

### Класс LarekApi

Расширяет класс Api. В конструкторе принемает cdn, базовый URL, а так же опции (необязательно). Имеет методы:  
- getCard - метод получения карточки.  
- getCardList - метод получения массива карточек.  
- orderProducts - метод отпраки заказа на сервер.  

## Presenter (Cписок событий)  

- отрисовка массива карточек
- окрытие карточки - при клике на нее - отрисовываем выбранную карточку.
- нажимаем на кнопку "в корзину" - товар добавляется в корзину.
- при клике на закрывающий крестик или поле вне модального окна - модальное окно закрывается.
- нажмаем на кнопку "оформить" - происходит смена моадльного окна с выбором способа оплаты и указанием адреса доставки.
- блокировка кнопки "далее" при отсутствии одного из параметов.
- при нажатии на кнопку "далее" - смена модального окна с указанием номера телефона и эл.почты. 
- блокировка кнопки "оплатить" при отсутствии одного из параметов.
- при нажатии на кнопку "оплатить" - смена модального окна с успешном офрмлением заказа. при этом очищается корзина.
- заказ отправляется на сервер. 
 

