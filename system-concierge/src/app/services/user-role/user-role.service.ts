import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUserRole } from '../../interfaces/iuser-role';
import { LayoutService } from '../../layouts/layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private companyId = this.layoutService.loginUser.companyId;
  private resaleId = this.layoutService.loginUser.resaleId;
  private token = localStorage.getItem('token');

  private urlBaseV1 = environment.URLBASE_V1;


  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  });

  constructor(private http: HttpClient, private layoutService: LayoutService) { }

  getAll$(): Observable<any> {
    return this.http.get<IUserRole>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/role/all");
  }

  getfilterId$(id: number): Observable<any> {
    return this.http.get<IUserRole>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/role/filter/code/" + id, { headers: this.httpOptions, observe: 'response' });
  }
}
