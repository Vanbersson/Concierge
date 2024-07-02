import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  companyId = sessionStorage.getItem('companyId');
  resaleId = sessionStorage.getItem('resaleId');

  private urlBaseV1 = environment.URLBASE_V1;



  constructor(private http: HttpClient) { }

  getAll$(): Observable<any> {
    return this.http.get<IUser>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/all");
  }

  getConsultores$(): Observable<any> {
    return this.http.get<IUser>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/user/role/2");
  }
}
