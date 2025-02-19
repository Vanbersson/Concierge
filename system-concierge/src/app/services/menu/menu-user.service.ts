import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuUser } from '../../models/menu/menu-user';
import { environment } from '../../../environments/environment';
import { TreeNode } from 'primeng/api';
import { MessageResponse } from '../../models/message/message-response';

@Injectable({
  providedIn: 'root'
})
export class MenuUserService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveMenu(menu: MenuUser): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/menu/user/save", menu, { headers: this.myHeaders(), observe: 'response' });
  }

  deleteMenu(menu: MenuUser): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/menu/user/delete", menu, { headers: this.myHeaders(), observe: 'response' });
  }

  getFilterMenuUser$(compamyId: number, resaleId: number, userId: number,): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>(environment.apiuUrl + "/menu/user/filter/" + compamyId + "/" + resaleId + "/" + userId, { headers: this.myHeaders() });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
