import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

//Interfaces
import { IAuth } from '../../interfaces/auth/iauth';
import { IAuthResponse } from '../../interfaces/auth/iauthresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(login: IAuth): Observable<HttpResponse<IAuthResponse>> {
    return this.http.post<IAuthResponse>(environment.apiuUrl + "/auth/login", login, { observe: "response" });
  }

}
