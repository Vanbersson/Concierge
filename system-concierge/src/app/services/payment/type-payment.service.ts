import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TypePayment } from '../../models/payment/type-payment';
import { MessageResponse } from '../../models/message/message-response';

@Injectable({
    providedIn: 'root'
})
export class TypePaymentService {

    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

    save(pay: TypePayment): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/payment/save", pay, { headers: this.myHeaders(), observe: 'response' });
    }
    update(pay: TypePayment): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/payment/update", pay, { headers: this.myHeaders(), observe: 'response' });
    }
    listAll(): Observable<TypePayment[]> {
        return this.http.get<TypePayment[]>(environment.apiuUrl + "/payment/" + this.companyResale + "/list/all", { headers: this.myHeaders() });
    }
    listAllEnabled(): Observable<TypePayment[]> {
        return this.http.get<TypePayment[]>(environment.apiuUrl + "/payment/" + this.companyResale + "/list/all/enabled", { headers: this.myHeaders() });
    }
    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}