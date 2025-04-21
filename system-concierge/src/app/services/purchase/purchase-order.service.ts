import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PurchaseOrder } from '../../models/purchase.order/puchase.order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  public save(purchase: PurchaseOrder): Observable<HttpResponse<PurchaseOrder>> {
    return this.http.post<PurchaseOrder>(environment.apiuUrl + "/purchase/order/save", purchase, { headers: this.myHeaders(), observe: 'response' });
  }

  public update(purchase: PurchaseOrder): Observable<HttpResponse<PurchaseOrder>> {
    return this.http.post<PurchaseOrder>(environment.apiuUrl + "/purchase/order/update", purchase, { headers: this.myHeaders(), observe: 'response' });
  }

  public filterOpen$(companyId: number, resaleId: number): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(environment.apiuUrl + "/purchase/order/" + companyId + "/" + resaleId + "/filter/open", { headers: this.myHeaders() });
  }
  public filterId$(companyId: number, resaleId: number, purchaseId: number): Observable<HttpResponse<PurchaseOrder>> {
    return this.http.get<PurchaseOrder>(environment.apiuUrl + "/purchase/order/" + companyId + "/" + resaleId + "/filter/id/" + purchaseId, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
