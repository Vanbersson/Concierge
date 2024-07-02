import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IUser } from '../../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAuth = environment.URL_AUTH;

  constructor(private http: HttpClient) { }

  login(login: any): Observable<any> {
    return this.http.post<IUser>(this.urlAuth, login, { observe: 'response' });
  }
}
