import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { VehicleModel } from '../../../models/vehicle-model';
import { InterfaceUpdateStatus } from '../../../interfaces/Interface-update-status';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {

  private apiGetAll = environment.Portaria_veiculo_modelo_All;

  private apiAdd = environment.portaria_veiculo_modelo_add;

  private apiUpdate = environment.portaria_veiculo_modelo_update;

  private apiUpdatestatus = environment.portaria_veiculo_modelo_updateStatus;

  constructor(private http: HttpClient) { }

  getAll$(): Observable<any> {

    return this.http.get<VehicleModel>(this.apiGetAll + "/2/2");

  }

  addModel$(model: any): Observable<any> {

    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(this.apiAdd, model, { headers: httpOptions, observe: 'events' });

  }

  updateModel$(model: any): Observable<any> {
    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post<VehicleModel>(this.apiUpdate, model, { headers: httpOptions, observe: 'events' });
  }

  updateStatus$(model: InterfaceUpdateStatus): Observable<any> {
    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post<InterfaceUpdateStatus>(this.apiUpdatestatus, model, { headers: httpOptions, observe: 'events' });
  }


}
