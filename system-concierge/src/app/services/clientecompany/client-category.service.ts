import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { MessageResponse } from '../../models/message/message-response';
import { ClientCategory } from '../../models/clientcompany/client-category';

@Injectable({
    providedIn: 'root'
})
export class ClientCategoryService {

    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

    listAll(): Observable<ClientCategory[]> {
        return this.http.get<ClientCategory[]>(environment.apiuUrl + "/clientcompany/category/" + this.companyResale + "/filter/all", { headers: this.myHeaders() });
    }

    filterId(id: number): Observable<HttpResponse<MessageResponse>> {
        return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/category/" + this.companyResale + "/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}