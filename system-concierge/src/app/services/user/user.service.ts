import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../../interfaces/iuser';
import { LayoutService } from '../../layouts/layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
    return this.http.get<IUser>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/all");
  }

  getConsultores$(): Observable<any> {
    return this.http.get<IUser>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/role/2");
  }

  updateUser(data: any): Observable<any> {
    return this.http.post<IUser>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/update", data, { headers: this.httpOptions, observe: 'response', });
  }
}
