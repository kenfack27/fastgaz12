import { HttpClient, HttpContext, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { environment } from "src/environments/environment.development";
import { CustomResponse } from "../model/custom-response";
import { SaleRequest } from "../model/request/sale-request";
import { CustomPageResponse } from "../model/custom-response-page";
import { Page } from "../model/page";
import { SaleItem } from "../model/sale-item";
import { Sale } from "../model/sale";

@Injectable({
    providedIn: 'root'
})

export class SaleService {

    private readonly URL = environment.URL + `/sale`;


    constructor(private http: HttpClient) { }


    getSaleWithPackagingByStoreAndDate$ = (storeId: number, createdDate: any) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/sales-summary/with-packaging?storeId=${storeId}&createdDate=${createdDate}`).pipe(catchError(this.handlerError));

    getSaleByStoreAndDate$ = (storeId: number, createdDate: any) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/sales-summary?storeId=${storeId}&createdDate=${createdDate}`).pipe();

    getSaleAmount(storeId: number): Observable<CustomResponse> {
        return this.http.get<any>(`${this.URL}/amount?storeId=${storeId}`)
            .pipe()
    }
    getNumberSale(storeId: number): Observable<CustomResponse> {
        return this.http.get<any>(`${this.URL}/total?storeId=${storeId}`)
    }
    // List of sale item form a store
    salesItem$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<SaleItem>>>>this.http
        .get<any>(`${this.URL}/item/${storeId}?page=${page}&size=${size}`)
        .pipe(catchError(this.handlerError));

    // List of sale form a store
    // Not yet implemented
    sales$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<Sale>>>>this.http
        .get<any>(`${this.URL}/sales?page=${page}&size=${size}&storeId=${storeId}`)
        .pipe(catchError(this.handlerError));

    // clear Item to the cart
    clearToCart$ = () => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/clear`);

    // Add Item to the cart
    addToCart$ = (request: SaleRequest, httpContext?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .post<any>(`${this.URL}/add`, request).pipe();

    // Not saved into databse
    carts$ = (context?: HttpContext) => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/cart`).pipe(
            catchError(this.handlerError)
        );

    // Add Item to the cart
    confirm$ = (storeId: number, httpContext?: HttpContext) => <Observable<CustomResponse>>this.http
        .post<any>(`${this.URL}/confirm/${storeId}`, httpContext).pipe();

    handlerError(error: HttpErrorResponse): Observable<never> {
        throw new Error(`An error occured - Error code :${error.message}`);
    }
}