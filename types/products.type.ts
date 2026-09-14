export interface Product {
    id: string;
    name: string;
    [key: string]: unknown;
}

export interface ProductsResponse {
    data: Product[];
    current_page: number;
    per_page: number;
    to: number;
    total: number;
    [key: string]: unknown;
}
