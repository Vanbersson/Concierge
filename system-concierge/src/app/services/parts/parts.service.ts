import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { Parts } from '../../models/parts/Parts';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
 // private urlBaseV1 = "http://10.0.0.26:8080/apiapollo/api/v1";

  constructor(private http: HttpClient, private storage: StorageService) { }

  save(parts: Parts): Observable<HttpResponse<Parts>> {
    return this.http.post<Parts>(environment.apiuUrl + "/parts/save", parts, { headers: this.myHeaders(), observe: 'response' });
  }
  update(parts: Parts): Observable<HttpResponse<Parts>> {
    return this.http.post<Parts>(environment.apiuUrl + "/parts/update", parts, { headers: this.myHeaders(), observe: 'response' });
  }
  getAll$(): Observable<Parts[]> {
    return this.http.get<Parts[]>(environment.apiuUrl + "/parts/filter/all", { headers: this.myHeaders(), responseType: 'json' });
  }
  getFilterBudget$(id: number): Observable<HttpResponse<Parts[]>> {
    return this.http.get<Parts[]>(environment.apiuUrl + "/parts/filter/budget/" + id, { headers: this.myHeaders(), observe: 'response', responseType: 'json' });
  }

  //External
  getExternalFilterId$(id: number): Observable<Parts[]> {
    return this.http.get<Parts[]>(environment.apiApollo  + "/pecitem/filter/item/" + id, { responseType: 'json' });
  }

  getExternalFilterCode$(code: string): Observable<HttpResponse<Parts[]>> {
    return this.http.get<Parts[]>(environment.apiApollo  + "/pecitem/filter/code/" + code, { observe: 'response', responseType: 'json' });
  }
  getExternalFilterDesc$(desc: string): Observable<HttpResponse<Parts[]>> {
    return this.http.get<Parts[]>(environment.apiApollo  + "/pecitem/filter/desc/" + desc, { observe: 'response', responseType: 'json' });
  }


  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
