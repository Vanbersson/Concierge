import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailClient } from '../../models/email/email-client';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/message/message-response';
import { environment } from '../../../environments/environment';
import { BudgetToken } from '../../models/budget/budget-token';

@Injectable({
  providedIn: 'root'
})
export class EmailClientService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  sendEmail(email: EmailClient): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/email/send", email, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
