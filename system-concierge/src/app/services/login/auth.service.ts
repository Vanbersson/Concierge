import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

//Interfaces
import { IAuth } from '../../interfaces/auth/iauth';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(login: IAuth): Observable<HttpResponse<User>> {
    return this.http.post<User>(environment.apiuUrl + "/auth/login", login, { observe: "response" });
  }

}
