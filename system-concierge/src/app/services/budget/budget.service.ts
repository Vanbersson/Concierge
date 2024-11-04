import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

import { IBudgetNew } from '../../interfaces/budget/ibudget-new';
import { BudgetRequisition } from '../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../models/budget/budget-item-service';
import { Budget } from '../../models/budget/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  addBudget$(vehicleId: IBudgetNew): Observable<HttpResponse<Budget>> {
    return this.http.post<Budget>(environment.apiuUrl + "/vehicle/entry/budget/save", vehicleId, { headers: this.myHeaders(), observe: 'response', responseType: 'json' });
  }

  updateBudget$(budget: Budget): Observable<HttpResponse<Budget>> {
    return this.http.post<Budget>(environment.apiuUrl + "/vehicle/entry/budget/update", budget, { headers: this.myHeaders(), observe: 'response', responseType: 'json' });
  }

  getBudgetFilterVehicle$(vehicleId: number): Observable<Budget> {
    return this.http.get<Budget>(environment.apiuUrl + "/vehicle/entry/budget/filter/vehicle/" + vehicleId, { headers: this.myHeaders() });
  }

  //Requisition
  saveBudgetRequisition$(requisition: BudgetRequisition): Observable<HttpResponse<BudgetRequisition>> {
    return this.http.post<BudgetRequisition>(environment.apiuUrl + "/vehicle/entry/budget/requisition/save", requisition, { headers: this.myHeaders(), observe: 'response' });
  }

  updateBudgetRequisition$(requisition: BudgetRequisition): Observable<HttpResponse<BudgetRequisition>> {
    return this.http.post<BudgetRequisition>(environment.apiuUrl + "/vehicle/entry/budget/requisition/update", requisition, { headers: this.myHeaders(), observe: 'response' });
  }

  getBudgetRequisition$(budgetId: number): Observable<BudgetRequisition[]> {
    return this.http.get<BudgetRequisition[]>(environment.apiuUrl + "/vehicle/entry/budget/requisition/filter/butget/" + budgetId, { headers: this.myHeaders() });
  }

  deleteBudgetRequisition$(requisition: BudgetRequisition): Observable<HttpResponse<BudgetRequisition>> {
    return this.http.post<BudgetRequisition>(environment.apiuUrl + "/vehicle/entry/budget/requisition/delete", requisition, { headers: this.myHeaders(), observe: 'response' });
  }

  //Service
  saveBudgetService$(service: BudgetServiceItem): Observable<HttpResponse<BudgetServiceItem>> {
    return this.http.post<BudgetServiceItem>(environment.apiuUrl + "/vehicle/entry/budget/service/save", service, { headers: this.myHeaders(), observe: 'response' });
  }

  updateBudgetService$(service: BudgetServiceItem): Observable<HttpResponse<BudgetServiceItem>> {
    return this.http.post<BudgetServiceItem>(environment.apiuUrl + "/vehicle/entry/budget/service/update", service, { headers: this.myHeaders(), observe: 'response' });
  }

  getBudgetService$(budgetId: number): Observable<BudgetServiceItem[]> {
    return this.http.get<BudgetServiceItem[]>(environment.apiuUrl + "/vehicle/entry/budget/service/filter/butget/" + budgetId, { headers: this.myHeaders() });
  }

  deleteBudgetService$(service: BudgetServiceItem): Observable<HttpResponse<BudgetServiceItem>> {
    return this.http.post<BudgetServiceItem>(environment.apiuUrl + "/vehicle/entry/budget/service/delete", service, { headers: this.myHeaders(), observe: 'response' });
  }

  deleteDiscountAllService$(budgetId: number): Observable<HttpResponse<BudgetServiceItem>> {
    return this.http.post<BudgetServiceItem>(environment.apiuUrl + "/vehicle/entry/budget/service/delete/all/discount/" + budgetId, "", { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
