import { TContacts } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Contacts extends Form<TContacts> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._events = events;

		this._email = container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		this._phone = container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
	}

	set email(value: string) {
		this._email.value = value;
		this._phone.value = value;
	}
}