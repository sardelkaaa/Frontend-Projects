import "./scss/styles.scss";

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBusket {
    items: TProductBusket[];
    total: number | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: IProduct[];
    total: number | null;
}

export interface IFormValidator {
    errors: string[];
    isValid: boolean;
}

export interface ICard extends IProduct {
    isSelected: boolean;
    order: IOrder;
}

export interface ISuccessStatus {
    total: number | null;
}

export interface IModal {
    content: HTMLElement;
}

export interface IAppState {
    getProducts(): Promise<IProduct[]>
    getProduct(id: string): Promise<IProduct>
    createOrder(order: IOrder): Promise<IOrder>
}

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

export interface IOrderState {
    id: string;
    total: number | string;
    setPayment(payment: string): void;
    setEmail(email: string): void;
    setField(field: keyof TOrderInput, value: string): void;
    isOrderSuccess(): boolean;
    clearOrder(): void;
}

export interface IProductsState {
    products: IProduct[];
    preview: string | null;
    getProducts(): IProduct[];
    getProduct(id: string): IProduct;
    setProducts(products: IProduct[]): void;
    setPreview(product: IProduct): void;
}

export interface IOrderListener  {
    onClick: () => void;
}

export interface ICardListener  {
    onClick: (e: MouseEvent) => void;
}

export type TProductBusket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TOrderInput = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export type TPaymentAndAddress = Pick<IOrder, 'payment' | 'address'>;

export type TPayment = 'card' | 'cash';

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    readonly baseUrl: string;
    get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}