import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { Permission } from '../../models/permission/permission';
import { Observable } from 'rxjs';
import { PermissionUser } from '../../models/permission/permission-user';
import { MessageResponse } from '../../models/message/message-response';


@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    constructor(private http: HttpClient, private storage: StorageService) { }
    saveUser(user: PermissionUser): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/permission/user/save", user, { headers: this.myHeaders(), observe: 'response' });
    }
    listAll(): Observable<Permission[]> {
        return this.http.get<Permission[]>(environment.apiuUrl + "/permission/all", { headers: this.myHeaders() });
    }
    deleteAllUser(user: PermissionUser): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/permission/user/all/delete", user, { headers: this.myHeaders(), observe: 'response' });
    }
    filterUser(compamyId: number, resaleId: number, userId: number): Observable<HttpResponse<MessageResponse>> {
        return this.http.get<MessageResponse>(environment.apiuUrl + "/permission/user/" + compamyId + "/" + resaleId + "/filter/u/" + userId, { headers: this.myHeaders(), observe: 'response' });
    }
    filterUserPermission(compamyId: number, resaleId: number, userId: number, permission: number): Observable<HttpResponse<MessageResponse>> {
        return this.http.get<MessageResponse>(environment.apiuUrl + "/permission/user/" + compamyId + "/" + resaleId + "/filter/u/" + userId + "/p/" + permission, { headers: this.myHeaders(), observe: 'response' });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}