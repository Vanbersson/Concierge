import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IBudgetRequisition } from '../../interfaces/budget/ibudget-requisition';
import { LayoutService } from '../../layouts/layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private companyId = this.layoutService.loginUser.companyId;
  private resaleId = this.layoutService.loginUser.resaleId;
  private token = localStorage.getItem('token');

  private urlBaseV1 = environment.URLBASE_V1;


  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  });

  constructor(private http: HttpClient, private layoutService: LayoutService) { }

  addBudget$(budget: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/budget/add", budget, { headers: this.httpOptions, observe: 'response' });
  }

  addBudgetRequisition$(requisition: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/budget/requisition/add", requisition, { headers: this.httpOptions, observe: 'response' });
  }

  listBudgetRequisition$(budgetId: number): Observable<any> {
    return this.http.get<IBudgetRequisition>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/budget/requisition/list/" + budgetId, { headers: this.httpOptions });
  }

  deleteBudgetRequisition$(requisition: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/budget/requisition/delete", requisition, { headers: this.httpOptions, observe: 'response' });
  }


}
