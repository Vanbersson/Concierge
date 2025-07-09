import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TypePayment } from '../../models/payment/type-payment';

@Injectable({
    providedIn: 'root'
})
export class TypePaymentService {

    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

    listAll(): Observable<TypePayment[]> {
        return this.http.get<TypePayment[]>(environment.apiuUrl + "/payment/" + this.companyResale + "/all", { headers: this.myHeaders() });
    }
    listAllEnabled(): Observable<TypePayment[]> {
        return this.http.get<TypePayment[]>(environment.apiuUrl + "/payment/" + this.companyResale + "/all/enabled", { headers: this.myHeaders() });
    }
    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}