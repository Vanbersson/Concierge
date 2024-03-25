import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { Auth } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.authLogin;

  constructor(private http: HttpClient) { }

  authLogin(login: Auth): Observable<User> {
    return this.http.post<User>(this.api, login);
  }
}
