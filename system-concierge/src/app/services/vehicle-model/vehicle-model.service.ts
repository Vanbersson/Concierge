import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { ModelVehicle } from '../../models/vehicle-model/model-vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {

  companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

  constructor(private http: HttpClient, private storage: StorageService) { }

  save(model: ModelVehicle): Observable<HttpResponse<ModelVehicle>> {
    return this.http.post<ModelVehicle>(environment.apiuUrl + "/vehicle/model/save", model, { headers: this.myHeaders(), observe: 'response' });
  }
  update(model: ModelVehicle): Observable<HttpResponse<ModelVehicle>> {
    return this.http.post<ModelVehicle>(environment.apiuUrl + "/vehicle/model/update", model, { headers: this.myHeaders(), observe: 'response' });
  }
  listAll(): Observable<ModelVehicle[]> {
    return this.http.get<ModelVehicle[]>(environment.apiuUrl + "/vehicle/model/"+this.companyResale+"/all", { headers: this.myHeaders() });
  }
  getAllEnabled(): Observable<ModelVehicle[]> {
    return this.http.get<ModelVehicle[]>(environment.apiuUrl + "/vehicle/model/"+this.companyResale+"/all/enabled", { headers: this.myHeaders() });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
