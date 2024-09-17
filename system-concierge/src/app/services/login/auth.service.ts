import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthResponse } from '../../interfaces/auth/iauthresponse';
import { IAuth } from '../../interfaces/auth/iauth';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(login: IAuth): Observable<HttpResponse<IAuthResponse>> {
    return this.http.post<IAuthResponse>(environment.apiuUrl + "/auth/login", login, { observe: "response", responseType: "json" });
  }


}
