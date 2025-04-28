import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../../../models/purchase.order/puchase.order';

@Injectable({
  providedIn: 'root'
})
export class PurchaseReportService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  public filter(filters: any): Observable<HttpResponse<PurchaseOrder[]>> {
    return this.http.post<PurchaseOrder[]>(environment.apiuUrl + "/reports/parts/purchase/order/filter", filters, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
