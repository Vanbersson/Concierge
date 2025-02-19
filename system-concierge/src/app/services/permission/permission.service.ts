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
    getAll$(): Observable<Permission[]> {
        return this.http.get<Permission[]>(environment.apiuUrl + "/permission/all", { headers: this.myHeaders() });
    }

    //User

    saveUser(user: PermissionUser): Observable<HttpResponse<PermissionUser>> {
        return this.http.post<PermissionUser>(environment.apiuUrl + "/permission/user/save", user, { headers: this.myHeaders(), observe: 'response' });
    }

    deleteUser(userId: number): Observable<HttpResponse<MessageResponse>> {
        return this.http.post<MessageResponse>(environment.apiuUrl + "/permission/user/all/delete", {
            "userId": userId
        }, { headers: this.myHeaders(), observe: 'response' });
    }

    getAllUser$(userId: number): Observable<PermissionUser[]> {
        return this.http.get<PermissionUser[]>(environment.apiuUrl + "/permission/user/filter/user/" + userId, { headers: this.myHeaders() });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}