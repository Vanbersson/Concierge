import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { UserRole } from '../../models/user-role/user-role';



@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  getAll$(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(environment.apiuUrl + "/user/role/all", { headers: this.myHeaders() });
  }
  getAllEnabled$(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(environment.apiuUrl + "/user/role/all/enabled", { headers: this.myHeaders() });
  }
  getFilterId$(id: number): Observable<HttpResponse<UserRole>> {
    return this.http.get<UserRole>(environment.apiuUrl + "/user/role/filter/code/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
