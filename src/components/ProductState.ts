import { IProduct, IProductsState } from "../types";
import { IEvents } from "./base/events";

export class ProductsState implements IProductsState {
    _products: IProduct[];
    _preview: string | null;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    get products() {
        return this._products;
    }

    get preview() {
        return this._preview;
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProduct(id: string): IProduct {
        return this._products.find((product) => product.id === id) || null;
    }

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('card:change');
    }

    setPreview(product: IProduct): void {
        this._preview = product.id;
        this.events.emit('preview:change', product);
    }
}