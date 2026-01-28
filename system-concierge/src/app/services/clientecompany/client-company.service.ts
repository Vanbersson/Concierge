import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { ClientCompany } from '../../models/clientcompany/client-company';
import { MessageResponse } from '../../models/message/message-response';

@Injectable({
  providedIn: 'root'
})
export class ClientCompanyService {

  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  save(client: ClientCompany): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/clientcompany/save", client, { headers: this.myHeaders(), observe: 'response' });
  }
  update(client: ClientCompany): Observable<HttpResponse<MessageResponse>> {
    return this.http.post<MessageResponse>(environment.apiuUrl + "/clientcompany/update", client, { headers: this.myHeaders(), observe: 'response' });
  }
  listAll(): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/all", { headers: this.myHeaders(), observe: 'response' });
  }
  filterId(id: Number): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
  }
  filterJFantasia(name: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/j/fantasia/" + name, { headers: this.myHeaders(), observe: 'response' });
  }
  filterFFantasia(name: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/f/fantasia/" + name, { headers: this.myHeaders(), observe: 'response' });
  }
  filterJName(name: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/j/name/" + name, { headers: this.myHeaders(), observe: 'response' });
  }
  filterFName(name: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/f/name/" + name, { headers: this.myHeaders(), observe: 'response' });
  }
  filterCNPJ(cnpj: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/cnpj/" + cnpj, { headers: this.myHeaders(), observe: 'response' });
  }
  filterCPF(cpf: string): Observable<HttpResponse<MessageResponse>> {
    return this.http.get<MessageResponse>(environment.apiuUrl + "/clientcompany/" + this.companyResale + "/filter/cpf/" + cpf, { headers: this.myHeaders(), observe: 'response' });
  }

  //Externa
  /* FilterIdExternal(id: Number): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/code/" + id, { responseType: 'json' });
  }
  FilterFantasiaJExternal(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/j/fantasia/" + name, { responseType: 'json' });
  }
  getFantasiaF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/f/fantasia/" + name, { responseType: 'json' });
  }
  FilterNameJExternal(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/j/name/" + name, { responseType: 'json' });
  }
  getNameF$(name: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/f/name/" + name, { responseType: 'json' });
  }
  filterCnpjExternal(cnpj: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/cnpj/" + cnpj, { responseType: 'json' });
  }
  filterCpfExternal(cpf: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/cpf/" + cpf, { responseType: 'json' });
  }
  getTipo$(tipo: string): Observable<ClientCompany[]> {
    return this.http.get<ClientCompany[]>(environment.apiApollo + "/fatclient/filter/tipo/" + tipo, { responseType: 'json' });
  } */

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
