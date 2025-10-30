import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/message/message-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 private companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;
  constructor(private http: HttpClient, private storage: StorageService) { }

   filterUser(userId: number): Observable<HttpResponse<MessageResponse>> {
          return this.http.get<MessageResponse>(environment.apiuUrl + "/notification/user/" + this.companyResale + "/filter/u/" + userId , { headers: this.myHeaders(), observe: 'response' });
      }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
