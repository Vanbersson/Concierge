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

  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  listAll(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(environment.apiuUrl + "/user/role/" + this.companyResale + "/all", { headers: this.myHeaders() });
  }
  listAllEnabled(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(environment.apiuUrl + "/user/role/" + this.companyResale + "/all/enabled", { headers: this.myHeaders() });
  }
  
  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
