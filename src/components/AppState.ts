import { IOrder, IProduct, IAppState, IApi } from "../types";
import { ApiListResponse } from "./base/api";

export class AppState implements IAppState {
    private _baseApi: IApi;
    private _baseUrl: string;

    constructor(baseUrl: string, baseApi: IApi)  {
        this._baseApi = baseApi;
        this._baseUrl = baseUrl;
    }

    getProducts(): Promise<IProduct[]> {
        return this._baseApi
            .get<ApiListResponse<IProduct>>('/product')
            .then((res) =>
                res.items.map((product) => ({
                    ...product,
                    image: this._baseUrl + product.image,
                }))
            );
    }

    getProduct(id: string): Promise<IProduct> {
        return this._baseApi
            .get<IProduct>(`/product/${id}`)
            .then(product => ({
                    ...product,
                    image: this._baseUrl + product.image,
                })
            );
    }

    createOrder(order: IOrder): Promise<IOrder> {
        return this._baseApi
            .post<IOrder>('/order', order)
            .then((data: IOrder) => data);
    }
}