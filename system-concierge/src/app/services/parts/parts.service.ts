import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { Part } from '../../models/parts/Part';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  save(parts: Part): Observable<HttpResponse<Part>> {
    return this.http.post<Part>(environment.apiuUrl + "/part/save", parts, { headers: this.myHeaders(), observe: 'response' });
  }
  update(parts: Part): Observable<HttpResponse<Part>> {
    return this.http.post<Part>(environment.apiuUrl + "/part/update", parts, { headers: this.myHeaders(), observe: 'response' });
  }
  getAll$(): Observable<Part[]> {
    return this.http.get<Part[]>(environment.apiuUrl + "/part/" + this.companyResale + "/filter/all", { headers: this.myHeaders() });
  }

  //External
  getExternalFilterId$(id: number): Observable<Part[]> {
    return this.http.get<Part[]>(environment.apiApollo + "/pecitem/filter/item/" + id, { responseType: 'json' });
  }
  getExternalFilterCode$(code: string): Observable<HttpResponse<Part[]>> {
    return this.http.get<Part[]>(environment.apiApollo + "/pecitem/filter/code/" + code, { observe: 'response', responseType: 'json' });
  }
  getExternalFilterDesc$(desc: string): Observable<HttpResponse<Part[]>> {
    return this.http.get<Part[]>(environment.apiApollo + "/pecitem/filter/desc/" + desc, { observe: 'response', responseType: 'json' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
