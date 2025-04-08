import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(environment.apiuUrl + "/user/save", user, { headers: this.myHeaders(), observe: 'response' });
  }
  updateUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(environment.apiuUrl + "/user/update", user, { headers: this.myHeaders(), observe: 'response' });
  }
  getAll$(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiuUrl + "/user/" + this.companyResale + "/all", { headers: this.myHeaders() });
  }
  getUserFilterId(id: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  getUserFilterEmail$(email: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/email/" + email, { headers: this.myHeaders(), observe: 'response' });
  }

  getUserFilterRoleId$(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiuUrl + "/user/" + this.companyResale + "/filter/roleId/" + roleId, { headers: this.myHeaders() });
  }
  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
