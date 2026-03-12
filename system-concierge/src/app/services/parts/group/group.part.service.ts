import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../storage/storage.service';
import { MessageResponse } from '../../../models/message/message-response';
import { GroupPart } from '../../../models/parts/group/group.part';

@Injectable({
    providedIn: 'root'
})
export class GroupPartService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;
    constructor(private http: HttpClient, private storage: StorageService) { }

    save(group: GroupPart): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/part/group/save", group, { headers: this.myHeaders(), observe: 'response' });
    }
    update(group: GroupPart): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/part/group/update", group, { headers: this.myHeaders(), observe: 'response' });
    }
    listAll(): Observable<GroupPart[]> {
        return this.http.get<GroupPart[]>(environment.apiuUrl + "/part/group/" + this.companyResale + "/list/all", { headers: this.myHeaders() });
    }

    filterBrand(brandId: number): Observable<GroupPart[]> {
        return this.http.get<GroupPart[]>(environment.apiuUrl + "/part/group/" + this.companyResale + "/filter/brand/" + brandId, { headers: this.myHeaders() });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}
