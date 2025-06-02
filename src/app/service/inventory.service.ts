import { Injectable } from "@angular/core";
import { CustomResponse } from "../model/custom-response";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CustomPageResponse } from "../model/custom-response-page";
import { Page } from "../model/page";
import { Inventory } from "../model/inventory";

@Injectable({
    providedIn: 'root'
})
export class inventoryService {

    private readonly URL = environment.URL + `/inventory`;

    constructor(private http: HttpClient) { }


    // Inventory details
    inventory$ = (id: number, storeId: number) => <Observable<CustomResponse>>
        this.http
            .get<any>(`${this.URL}?id=${id}&storeId=${storeId}`)
            .pipe(catchError(this.handlerError));

    // List of inventory form a store
    inventories$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<Inventory>>>>
        this.http
            .get<any>(`${this.URL}/page/inventories?page=${page}&size=${size}&storeId=${storeId}`)
            .pipe(catchError(this.handlerError));



    handlerError(error: HttpErrorResponse): Observable<never> {
        throw new Error(`An error occured - Error code :${error.message}`);
    }

}