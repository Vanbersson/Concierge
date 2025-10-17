import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ToolControlMaterial } from '../../../models/workshop/toolcontrol/tool-control-material';
import { MessageResponse } from '../../../models/message/message-response';

@Injectable({
    providedIn: 'root'
})
export class ToolControlMaterialService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

    saveMat(mat: ToolControlMaterial): Observable<HttpResponse<ToolControlMaterial>> {
        return this.http.post<ToolControlMaterial>(environment.apiuUrl + "/workshop/tool/control/material/save", mat, { headers: this.myHeaders(), observe: 'response' });
    }
    updateMat(mat: ToolControlMaterial): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/workshop/tool/control/material/update", mat, { headers: this.myHeaders(), observe: 'response' });
    }
    listAll(): Observable<ToolControlMaterial[]> {
        return this.http.get<ToolControlMaterial[]>(environment.apiuUrl + "/workshop/tool/control/material/" + this.companyResale + "/all", { headers: this.myHeaders() });
    }
    listAllEnabled(): Observable<ToolControlMaterial[]> {
        return this.http.get<ToolControlMaterial[]>(environment.apiuUrl + "/workshop/tool/control/material/" + this.companyResale + "/all/enabled", { headers: this.myHeaders() });
    }
    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}