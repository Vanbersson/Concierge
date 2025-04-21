import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { PurchaseOrderItem } from '../../models/purchase.order/purchase.order.item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderItemService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  public save(item: PurchaseOrderItem): Observable<HttpResponse<PurchaseOrderItem>> {
    return this.http.post<PurchaseOrderItem>(environment.apiuUrl + "/purchase/order/item/save", item, { headers: this.myHeaders(), observe: 'response' });
  }
  public update(item: PurchaseOrderItem): Observable<HttpResponse<PurchaseOrderItem>> {
    return this.http.post<PurchaseOrderItem>(environment.apiuUrl + "/purchase/order/item/update", item, { headers: this.myHeaders(), observe: 'response' });
  }
  public delete(item: PurchaseOrderItem): Observable<HttpResponse<PurchaseOrderItem>> {
    return this.http.post<PurchaseOrderItem>(environment.apiuUrl + "/purchase/order/item/delete", item, { headers: this.myHeaders(), observe: 'response' });
  }
  public filterId(companyId: number, resaleId: number, purchaseId: number): Observable<PurchaseOrderItem[]> {
    return this.http.get<PurchaseOrderItem[]>(environment.apiuUrl + "/purchase/order/item/" + companyId + "/" + resaleId + "/filter/purchase/" + purchaseId, { headers: this.myHeaders() });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
