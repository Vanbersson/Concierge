import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientCompany } from '../../interfaces/iclient-company';

@Injectable({
  providedIn: 'root'
})
export class ClientecompanyService {

  companyId = sessionStorage.getItem('companyId');
  resaleId = sessionStorage.getItem('resaleId');

  private urlBaseV1 = environment.URLBASE_V1;


  constructor(private http: HttpClient) { }

  getAll$(): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/all");
  }

  getId$(id: Number): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/filter/id/" + id);
  }

  getName$(name: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/filter/name/" + name);
  }

  getCnpj$(cnpj: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/filter/cnpj/" + cnpj);
  }

  getCpf$(cpf: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/filter/cpf/" + cpf);
  }

  getRg$(rg: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/clientCompany/filter/rg/" + rg);
  }
}
