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

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(environment.apiuUrl + "/user/save", user, { headers: this.myHeaders(), observe: 'response' });
  }
  updateUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(environment.apiuUrl + "/user/update", user, { headers: this.myHeaders(), observe: 'response' });
  }
  getAll$(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiuUrl + "/user/all", { headers: this.myHeaders() });
  }
  getUserFilterId(id: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(environment.apiuUrl + "/user/filter/id/" + id, { headers: this.myHeaders(), observe: 'response'});
  }
  getUserFilterEmail$(email: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(environment.apiuUrl + "/user/filter/email/" + email, { headers: this.myHeaders(), observe: 'response'});
  }
  getUserFilterRoleId$(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiuUrl + "/user/filter/roleId/" + roleId, { headers: this.myHeaders() });
  }
  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
