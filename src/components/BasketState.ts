import { IBusketState, IOrderState, IProduct, TProductBusket } from "../types";
import { IEvents } from "./base/events";

export class BasketState implements IBusketState {
    protected _products: TProductBusket[] = [];

    constructor(protected events: IEvents) {
        this.events = events;
    }

    get products(): TProductBusket[] {
        return this._products;
    }

    addProduct(product: TProductBusket): void {
        this._products.push(product);
        this.events.emit('basket:change');
    }

    removeProduct(product: TProductBusket) {
		this._products = this._products.filter(
			(_product) => _product.id !== product.id
		);
		this.events.emit('basket:change');
	}

    getTotalPrice(): number | null {
        let total = 0;
        this._products.map((product) => total += product.price);
        return total;
    }

    getTotalCount(): number {
        return this._products.length;
    }

    clear(): void {
        this._products = [];
        this.events.emit('basket:change');
    }

    placeOrder(order: IOrderState): void {
        const orderItems = this._products.map((product) => product.id);
        order.setField('items', orderItems);
        order.setField('total', this.getTotalPrice());
    }

    getButtonStatus(product: TProductBusket) {
		if (
			product.price === null ||
			product.price === undefined ||
			String(product.price) === 'Бесценно'
		) {
			return 'Нельзя купить';
		}
		return !this._products.some((card) => card.id === product.id)
			? 'Купить'
			: 'Удалить';
	}

    isBasketCard(product: TProductBusket) {
		return !this.products.some((card) => card.id === product.id)
			? this.addProduct(product)
			: this.removeProduct(product);
	}
}