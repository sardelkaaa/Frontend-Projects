import './scss/styles.scss';
import { IEvents, EventEmitter } from './components/base/events';
import { ProductsState } from './components/ProductState';
import { BasketState } from './components/BasketState';
import { OrderState } from './components/OrderState';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Card, BasketCard } from './components/Card';
import { Modal } from './components/Modal';
import { IApi, IProduct, IOrder, TPayment} from './types/index';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Contacts } from './components/Contacts';
import { Payment } from './components/Payment';
import { Success } from './components/Success';

const baseApi: IApi = new Api(API_URL);
const api = new AppState(CDN_URL, baseApi);
const events: IEvents = new EventEmitter();

const productsState = new ProductsState(events);
const basketState = new BasketState(events);
const orderState = new OrderState(events);

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
const body = document.body;

const page = new Page(document.body, events);
const modal = new Modal(modalContainerTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactForm = new Contacts(cloneTemplate(contactsTemplate), events);
const orderForm = new Payment(cloneTemplate(orderTemplate), events);

events.on('card:change', () => {
	page.counter = basketState.products.length;
	page.catalog = productsState.products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:selected', product);
			},
		});
		return card.render({
			id: product.id,
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

events.on('card:selected', (product: IProduct) => {
	productsState.setPreview(product);
});

events.on('preview:change', (product: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', product);
			events.emit('preview:change', product);
			modal.close();
		},
	});

	modal.render({
		content: card.render({
			id: product.id,
			category: product.category,
			description: product.description,
			image: product.image,
			price: product.price,
			title: product.title,
			buttonText: basketState.getButtonStatus(product),
		}),
	});
});

events.on('card:basket', (product: IProduct) => {
	basketState.isBasketCard(product);
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:change', () => {
	page.counter = basketState.products.length;
	basket.price = basketState.getTotalPrice();
	basket.items = basketState.products.map((basketCard, index) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketState.removeProduct(basketCard);
			},
		});
		newBasketCard.index = index + 1;
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			isValid: false,
			address: '',
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		orderState.setField(data.field, data.value);
	}
);

events.on(
	'order:change',
	(data: { payment: TPayment; button: HTMLElement }) => {
		orderForm.togglePayment(data.button);
		orderState.setPayment(data.payment);
		orderState.isOrderSuccess();
	}
);

events.on('errors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;

	orderForm.valid = !(payment || address);
	orderForm.errors = [payment, address].filter(Boolean).join('; ');

	contactForm.valid = !(email || phone);
	contactForm.errors = [email, phone].filter(Boolean).join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contactForm.render({
			phone: '',
			email: '',
			isValid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	basketState.placeOrder(orderState);

	api.createOrder(orderState.order)
		.then((result) => {
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			basketState.clear();
			orderState.clearOrder();
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})

		.catch((error) => {
			console.error(`Произошла ошибка при отправке заказа: ${error}`);
			alert(
				'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.'
			);
		});
});

api.getProducts()
	.then((response) => {
		console.log(response)
		Array.isArray(response)
			? productsState.setProducts(response)
			: console.error('Получен некорректный список продуктов', response);
	})
	.catch((error) => {
		console.error(`Произошла ошибка при получении списка продуктов: ${error}`);
		
	});