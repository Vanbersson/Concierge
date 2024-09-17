import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ValidToken {
    private token = localStorage.getItem('token');

    private urlAuth = "http://localhost:9000/auth/validToken";

    private httpOptions = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
    });

    constructor(private http: HttpClient) { }

    validToken(): Observable<any> {
       return  this.http.post(this.urlAuth, { Headers: this.httpOptions, observe: "response" });
    }
}