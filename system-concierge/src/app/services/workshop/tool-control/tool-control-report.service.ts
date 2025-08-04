import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Observable, shareReplay } from 'rxjs';
import { ToolControlReport } from '../../../models/workshop/report/tool-control-report';

@Injectable({
    providedIn: 'root'
})
export class ToolcontrolReportService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

    filterMec(mechanicId: number): Observable<HttpResponse<ToolControlReport>> {
        return this.http.get<ToolControlReport>(environment.apiuUrl + "/workshop/tool/control/report/" + this.companyResale + "/all/filter/" + mechanicId + "/mec", { headers: this.myHeaders(), observe: 'response' });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}