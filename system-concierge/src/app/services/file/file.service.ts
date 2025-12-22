import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/message/message-response';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  public uploadImage(data: FormData): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/file/upload/image", data, { headers: this.myHeaders(), observe: 'response' });
  }
  public deleteImage(url: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/file/delete/image", { local: url }, { headers: this.myHeaders(), observe: 'response' });
  }
  public findImage(url: string): Observable<HttpResponse<string>> {
    return this.http.get<string>(environment.apiuUrl + "/images/" + this.companyResale + url, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
