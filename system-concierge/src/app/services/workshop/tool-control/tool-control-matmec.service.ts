import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ToolControlMatMec } from '../../../models/workshop/toolcontrol/tool-control-matmec';

@Injectable({
    providedIn: 'root'
})
export class ToolControlMatMecService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }
    
    save(matMec: ToolControlMatMec): Observable<HttpResponse<ToolControlMatMec>> {
        return this.http.post<ToolControlMatMec>(environment.apiuUrl + "/workshop/tool/control/matmec/save", matMec, { headers: this.myHeaders(), observe: 'response' });
    }
    update(matMec: ToolControlMatMec): Observable<HttpResponse<ToolControlMatMec>> {
        return this.http.post<ToolControlMatMec>(environment.apiuUrl + "/workshop/tool/control/matmec/update", matMec, { headers: this.myHeaders(), observe: 'response' });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}