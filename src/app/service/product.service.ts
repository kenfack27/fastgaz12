import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment.development";
import { CustomResponse } from "../model/custom-response";
import { Page } from "../model/page";
import { CustomPageResponse } from "../model/custom-response-page";
import { ProductRequest } from "../model/request/product-request";
import { Product } from "../model/product";


@Injectable({
    providedIn: 'root'
})

export class ProductService {


    private readonly URL = environment.URL + `/product`;


    constructor(private http: HttpClient) { }

    /**
     * It will be used when we want to make sur that product exists in the provided store.
     */
    products$ = (storeId: number) => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/store/products?storeId=${storeId}`)
        .pipe(catchError(this.handlerError));

    /**
     * It will be used when we want to make sur that product exists in the provided store.
     * @param page 
     * @param size 
     * @param storeId 
     * @returns 
     */
    productsInMyStore$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<Product>>>>
        this.http
            .get<any>(`${this.URL}/store/${storeId}`)
            .pipe(
                tap(console.log),
            );


    productList$ = (storeId: any) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/no-secure/store?storeId=${storeId}`)
            .pipe(catchError(this.handlerError));


    create$ = (storeRequest: ProductRequest) => <Observable<CustomResponse>>
        this.http
            .post<any>(`${this.URL}/add`, storeRequest)
            .pipe(tap(console.log));

    // productList$ = () => <Observable<CustomResponse>>
    //     this.http
    //         .get<any>(`${this.URL}`).pipe(
    //             catchError(this.handlerError)
    //         );

    // products$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page>>>
    //     this.http
    //         .get<any>(`${this.URL}`).pipe(
    //             catchError(this.handlerError)
    //         );

    handlerError(error: HttpErrorResponse): Observable<never> {
        throw new Error(`An error occured - Error code :${error.message}`);
    }

}