import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

//class
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';
import { VehicleEntryAuth } from '../../models/vehicle/vehicle-entry-auth';
import { VehicleExit } from '../../models/vehicle/vehicle-exit';
import { MessageResponse } from '../../models/message/message-response';


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    companyResale: string = this.storage.companyId + "/" + this.storage.resaleId;

    constructor(private http: HttpClient, private storage: StorageService) { }

     countVehiclePenAuthBud(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/vehicle/pen/auth/bud", { headers: this.myHeaders(), observe: 'response' });
    }

    countYesServiceFilterYear(year: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/yes/service/year/" + year, { headers: this.myHeaders(), observe: 'response' });
    }

    countNotServiceFilterYear(year: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/not/service/year/" + year, { headers: this.myHeaders(), observe: 'response' });
    }

    countYesServiceFilterYearClient(year: number, clientId: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/yes/service/year/" + year + "/client/" + clientId, { headers: this.myHeaders(), observe: 'response' });
    }

    countVehicleFilterYear(year: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/vehicle/year/" + year, { headers: this.myHeaders(), observe: 'response' });
    }
    countVehicleFilterYearClient(year: number, clientId: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.apiuUrl + "/dashboard/" + this.companyResale + "/filter/vehicle/year/" + year + "/client/" + clientId, { headers: this.myHeaders(), observe: 'response' });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }
}