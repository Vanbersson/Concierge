import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { ClientCompany } from '../../models/clientcompany/client-company';

@Injectable({
  providedIn: 'root'
})
export class ClientecompanyService {

  private urlBaseV1 = "http://10.0.0.26:8080/apiapollo/api/v1/fatclient/filter";



  constructor(private http: HttpClient, private storage: StorageService) { }

  save(client: ClientCompany): Observable<HttpResponse<ClientCompany>> {
    return this.http.post<ClientCompany>(environment.apiuUrl + "/clientcompany/save", client, { headers: this.myHeaders(), observe: 'response' });
  }
  update(client: ClientCompany): Observable<HttpResponse<ClientCompany>> {
    return this.http.post<ClientCompany>(environment.apiuUrl + "/clientcompany/update", client, { headers: this.myHeaders(), observe: 'response' });
  }
  getAll$(): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiuUrl + "/clientcompany/filter/all", { headers: this.myHeaders(), responseType: 'json' });
  }
  getId$(id: Number): Observable<HttpResponse<ClientCompany> > {
    return this.http.get<ClientCompany>(environment.apiuUrl + "/clientcompany/filter/id/" + id, { headers: this.myHeaders(), observe:'response' });
  }

  //Externa

  getIdExternal$(id: Number): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/code/" + id, { responseType: 'json' });
  }

  getFantasiaJ$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/j/fantasia/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }
  getFantasiaF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/f/fantasia/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }
  getNameJ$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/j/name/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }
  getNameF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/f/name/" + name, { headers: this.myHeaders(), responseType: 'json' });
  }

  getCnpj$(cnpj: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/cnpj/" + cnpj, { headers: this.myHeaders(), responseType: 'json' });
  }

  getCpf$(cpf: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/cpf/" + cpf, { headers: this.myHeaders(), responseType: 'json' });
  }

  getTipo$(tipo: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(this.urlBaseV1 + "/tipo/" + tipo, { headers: this.myHeaders(), responseType: 'json' });
  }


  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
