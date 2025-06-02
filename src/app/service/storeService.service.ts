import { HttpClient, HttpContext, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap } from "rxjs";
import { environment } from "src/environments/environment.development";
import { CustomResponse } from "../model/custom-response";
import { StoreRequest } from "../model/request/storeRequest";
import { CustomPageResponse } from "../model/custom-response-page";
import { Page } from "../model/page";
import { Store } from "../model/store";
import { StoreUpdateRequest } from "../model/request/store-update-request";

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private readonly URL = environment.URL + `/stores`;
    private readonly STORE_ID = "STORE_ID";
    customerOrderService: any;

    constructor(private http: HttpClient) { }


    addUserToStore$ = (email: string, storeID: number) => <Observable<CustomResponse>>
        this.
            http
            .get<any>(`${this.URL}/add-new-manager-to-store?userEmail=${email}&storeId=${storeID}`);

    storeUUID$ = (uuid: string) => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/fake/${uuid}`);

    store$ = (id: number) => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/${id}`).pipe(
            catchError(this.handlerError)
        );

    create$ = (storeRequest: StoreRequest) => <Observable<CustomResponse>>
        this.http
            .post<any>(`${this.URL}/add`, storeRequest);

    update$ = (request: StoreUpdateRequest,httpContent?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .put<any>(`${this.URL}/update`, request);

    ListOfMyStores$ = (httpContext?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/mystores`).pipe(
                catchError(this.handlerError)
            );

    //  List of all  store
    storeList$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page<Store>>>>
        this.http
            .get<any>(`${this.URL}/no-secure-store?page=${page}&size=${size}`)
            .pipe();


    isStoreOwner$ = (httpContent?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/isOwner`);

    // stores$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page>>>this.http
    //     .get<any>(`${this.URL}`).pipe(
    //         catchError(this.handlerError)
    //     );


    getStoreByStoreId$ = (storeId: number, httpContext?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/store-owner?storeId=${storeId}`).pipe(

        );

    enableStore$ = (storeId: number, enable: boolean, httpContext?: HttpContext) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}/enable-store?storeId=${storeId}&enable=${enable}`).pipe(
                tap(console.log)
            );

    handlerError(error: HttpErrorResponse): Observable<never> {
        throw new Error(`An error occured - Error code :${error.message}`);
    }

    //  List of all  store
    AllStoreList$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page<Store>>>>
        this.http
            .get<any>(`${this.URL}/all-store?page=${page}&size=${size}`)
            .pipe(
                catchError(this.handlerError)
            );

    getAllActiveStore$ = () => <Observable<CustomResponse>>this.http
        .get<any>(`${this.URL}/active-store`).pipe(
            tap(console.log));




    setStoreID(id: string) {
        localStorage.setItem(this.STORE_ID, id);
    }
    getStoreID() {
        return localStorage.getItem(this.STORE_ID);
    }
}


