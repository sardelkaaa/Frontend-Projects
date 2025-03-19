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

## Архитектура проекта
Проект построен с использованием принципов MVP и разделен на следующие слои:

- Model (Модель): Отвечает за управление данными приложения, включая состояние корзины, заказов и продуктов.

- View (Представление): Отвечает за отображение данных пользователю (например, карточки товаров, модальные окна).

- Presenter (Презентер): Управляет взаимодействием между Model и View.

### Uml-диаграмма
![jLRDRYGr4BxFKrYvC41ouDeQ3Hl2h5WfqOusirmG1yUkJ4pSTijs3unOf5tWm8qtu1bMQ8EMduHNw7uZx75NUcow4Jbif9buN9-hllfSPVkHTTIukfIJzqZpI_Dt-xAvQTxupv_-SzkyRMw8_xfjlszksfVjZtxoz_PLSzVywgT9yuU7lMvVnPc9K0xC9ML0dYpf6iYt4-B_FcIw3eQ2gB](https://github.com/user-attachments/assets/1f0bcc0c-e112-48f5-9dfc-6ca7e14a776b)


### Основные компоненты
- AppState - Управляет состоянием приложения. Взаимодействует с API для получения данных о продуктах и создания заказов.

```
export interface IAppState {
    getProducts(): Promise<IProduct[]>
    getProduct(id: string): Promise<IProduct>
    createOrder(order: IOrder): Promise<IOrder>
}
```

- BasketState - Управляет состоянием корзины. Добавляет и удаляет продукты, рассчитывает общую стоимость.

```
export interface IBusketState {
    products: TProductBusket[];
    addProduct(product: IProduct): void;
    removeProduct(id: string): void;
    getTotalPrice(): number | null;
    getTotalCount(): number;
    getBusketProducts(): IProduct[];
    clear(): void;
    placeOrder(order: IOrderState): void;
}
```

- OrderState - Управляет состоянием заказа. Устанавливает способ оплаты, адрес и другие данные.

```
export interface IOrderState {
    id: string;
    total: number | string;
    setPayment(payment: string): void;
    setEmail(email: string): void;
    setField(field: keyof TOrderInput, value: string): void;
    isOrderSuccess(): boolean;
    clearOrder(): void;
}
```

- ProductsState - Управляет состоянием продуктов. Получает список продуктов и устанавливает превью продукта.

```
export interface IProductsState {
    products: IProduct[];
    preview: string | null;
    getProducts(): IProduct[];
    getProduct(id: string): IProduct;
    setProducts(products: IProduct[]): void;
    setPreview(product: IProduct): void;
}
```

- Api - Отвечает за взаимодействие с API. Выполняет GET и POST запросы.

```
export interface IApi {
    readonly baseUrl: string;
    get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

- Modal - Управляет модальными окнами.Используется для отображения подтверждения заказа.

```
export interface IModal {
    content: HTMLElement;
}
```

- Card - Представляет карточку продукта. Взаимодействует с BasketState для добавления продукта в корзину.

```
export interface ICard extends IProduct {
    isSelected: boolean;
    order: IOrder;
}
```

- FormValidator - Отвечает за валидацию данных в формах заказа.

```
export interface IFormValidator {
    errors: string[];
    isValid: boolean;
}
```

### Взаимодействие компонентов
- AppState взаимодействует с Api для получения данных о продуктах и создания заказов.

- BasketState взаимодействует с ProductsState для добавления и удаления продуктов из корзины.

- OrderState взаимодействует с BasketState для размещения заказа.

- Modal используется для отображения модальных окон, например, для подтверждения заказа.

- Card представляет продукт и взаимодействует с BasketState для добавления продукта в корзину.

- FormValidator используется для валидации данных в формах заказа.


## Основные типы данных

IProduct:

- Описывает структуру продукта:

```
interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}
```

IBasket:

- Описывает состояние корзины:

```
interface IBasket {
    items: TProductBasket[];
    total: number | null;
}
```

IOrder:

- Описывает структуру заказа:

```
interface IOrder extends IOrderForm {
    items: IProduct[];
    total: number | null;
}
```

IOrderForm:

- Описывает данные формы заказа:

```
interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}
```

IApi:

- Описывает методы взаимодействия с API:

```
interface IApi {
    readonly baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```
