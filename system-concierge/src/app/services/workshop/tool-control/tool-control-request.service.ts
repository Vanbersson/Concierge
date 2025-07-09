import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ToolControlRequest } from '../../../models/workshop/toolcontrol/tool-control-request';

@Injectable({
    providedIn: 'root'
})
export class ToolControlRequestService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }
    
    save(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/save", req, { headers: this.myHeaders(), observe: 'response' });
    }
    update(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/update", req, { headers: this.myHeaders(), observe: 'response' });
    }
    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}