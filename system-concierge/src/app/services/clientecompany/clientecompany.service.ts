import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { ClientCompany } from '../../models/clientcompany/client-company';

@Injectable({
  providedIn: 'root'
})
export class ClientecompanyService {

  //private urlBaseV1 = "http://10.0.0.20:9000/api/v1/fatclient/filter";



  constructor(private http: HttpClient, private storage: StorageService) { }

  save(id: Number): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/save/" + id, { headers: this.myHeaders(), observe: 'response' });
  }
  update(id: Number): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/update/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  getId$(id: Number): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/filter/id/" + id, { headers: this.myHeaders(), observe: 'response',responseType: 'json' });
  }

  getFantasiaJ$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/j/fantasia/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }

  getFantasiaF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/f/fantasia/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }

  getNameJ$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/j/name/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }
  getNameF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/f/name/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }

  getCnpj$(cnpj: string): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/filter/cnpj/" + cnpj, { headers: this.myHeaders(),observe: 'response', responseType: 'json' });
  }

  getCpf$(cpf: string): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/filter/cpf/" + cpf, { headers: this.myHeaders(),observe: 'response', responseType: 'json' });
  }

  getRg$(rg: string): Observable<HttpResponse<ClientCompany>> {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/filter/rg/" + rg, { headers: this.myHeaders(),observe: 'response', responseType: 'json' });
  }
  getTipo$(tipo: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/tipo/" + tipo, { headers: this.myHeaders(), responseType: 'json' });
  }


  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
