import { IOrder, IOrderState, TOrderInput, TPayment } from "../types";
import { IEvents } from "./base/events";

export class OrderState implements IOrderState {
    protected _order: IOrder = {
        items: [],
        total: 0,
        email: '',
        payment: '',
        address: '',
        phone: ''
    };
    protected _formErrors: Partial<Record<keyof IOrder, string>>;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    get order() {
        return this._order;
    }

    get formErrors() {
        return this._formErrors;
    }

    setPayment(payment: TPayment): void {
        this._order.payment = payment;
    }

    setEmail(email: string): void {
        this._order.email = email;
    }

    setAddress(value: string) {
		this._order.phone = value;
	}

    setField(field: keyof TOrderInput, value: string): void {
        this._order[field] = value;
        this.isOrderSuccess();
    }

    isOrderSuccess(): boolean {
        const errors: typeof this.formErrors = {};

        if (!this._order.payment) {
            errors.payment = 'Не указан способ оплаты';
        } else if (!this._order.address) {
            errors.address = 'Не указан адрес доставки';
        } else if (!this._order.email) {
            errors.email = 'Не указана электронная почта';
        } else if (!this._order.phone) {
            errors.phone = 'Не указан номер телефона';
        }

        this._formErrors = errors;
        this.events.emit('errors:change', this._formErrors);

        return Object.keys(errors).length === 0;
    }

    clearOrder(): void {
        this._order = {
            items: [],
            total: 0,
            email: '',
            payment: '',
            address: '',
            phone: ''
        };
    }
}