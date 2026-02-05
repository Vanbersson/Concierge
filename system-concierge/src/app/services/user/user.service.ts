import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { User } from '../../models/user/user';
import { MessageResponse } from '../../models/message/message-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveUser(user: User): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/user/save", user, { headers: this.myHeaders(), observe: 'response' });
  }
  updateUser(user: User): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/user/update", user, { headers: this.myHeaders(), observe: 'response' });
  }
  listAll(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiuUrl + "/user/" + this.companyResale + "/all", { headers: this.myHeaders() });
  }
  filterId(id: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  filterEmail(email: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/email/" + email, { headers: this.myHeaders(), observe: 'response' });
  }

  filterRoleId(roleId: number): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/roleId/" + roleId, { headers: this.myHeaders(), observe: 'response' });
  }

  uploadImage(data: FormData): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/user/upload/image", data, { headers: this.myHeaders(), observe: 'response' });
  }

  public deleteImage(): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/user/delete/image", {}, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
