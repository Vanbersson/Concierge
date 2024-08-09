import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientCompany } from '../../interfaces/iclient-company';

@Injectable({
  providedIn: 'root'
})
export class ClientecompanyService {

  private urlBaseV1 = "http://10.0.0.20:9000/api/v1/fatclient/filter";

  constructor(private http: HttpClient) { }

  getId$(id: Number): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/code/" + id);
  }

  getFantasiaJ$(name: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/j/fantasia/" + name);
  }

  getFantasiaF$(name: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/f/fantasia/" + name);
  }

  getNameJ$(name: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/j/name/" + name);
  }
  getNameF$(name: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/f/name/" + name);
  }

  getCnpj$(cnpj: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/cnpj/" + cnpj);
  }

  getCpf$(cpf: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/cpf/" + cpf);
  }

  getRg$(rg: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/rg/" + rg);
  }
  getTipo$(tipo: string): Observable<any> {
    return this.http.get<IClientCompany>(this.urlBaseV1 + "/tipo/" + tipo);
  }
}
