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
    newRequest(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/new", req, { headers: this.myHeaders(), observe: 'response' });
    }
     updateRequest(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/update", req, { headers: this.myHeaders(), observe: 'response' });
    }
    loanRequest(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/loan", req, { headers: this.myHeaders(), observe: 'response' });
    }
    loanReturn(req: ToolControlRequest): Observable<HttpResponse<ToolControlRequest>> {
        return this.http.post<ToolControlRequest>(environment.apiuUrl + "/workshop/tool/control/request/loan/return", req, { headers: this.myHeaders(), observe: 'response' });
    }
    filterMechanicId(id: number): Observable<ToolControlRequest[]> {
        return this.http.get<ToolControlRequest[]>(environment.apiuUrl + "/workshop/tool/control/request/" + this.companyResale + "/filter/mechanic/" + id, { headers: this.myHeaders() });
    }
    listRequestStatus(status: string): Observable<ToolControlRequest[]> {
        return this.http.get<ToolControlRequest[]>(environment.apiuUrl + "/workshop/tool/control/request/" + this.companyResale + "/filter/status/" + status, { headers: this.myHeaders() });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}