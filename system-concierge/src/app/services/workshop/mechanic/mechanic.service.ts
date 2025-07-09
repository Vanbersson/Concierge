import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Mechanic } from '../../../models/workshop/mechanic/Mechanic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  saveMec(mec: Mechanic): Observable<HttpResponse<Mechanic>> {
    return this.http.post<Mechanic>(environment.apiuUrl + "/workshop/mechanic/save", mec, { headers: this.myHeaders(), observe: 'response' });
  }
  updateMec(mec: Mechanic): Observable<HttpResponse<Mechanic>> {
    return this.http.post<Mechanic>(environment.apiuUrl + "/workshop/mechanic/update", mec, { headers: this.myHeaders(), observe: 'response' });
  }

  listAll(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(environment.apiuUrl + "/workshop/mechanic/" + this.companyResale + "/all", { headers: this.myHeaders() });
  }
  listAllEnabled(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(environment.apiuUrl + "/workshop/mechanic/" + this.companyResale + "/all/enabled", { headers: this.myHeaders() });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
