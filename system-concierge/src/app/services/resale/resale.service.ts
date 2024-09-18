import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Resale } from '../../models/resale/resale';


@Injectable({
    providedIn: 'root'
})
export class ResaleService {

    constructor(private http: HttpClient, private storage: StorageService) { }


    public getFilterCompany(companyId: number): Observable<Resale[]> {
        return this.http.get<Resale[]>(environment.apiuUrl + "/resale/filter/company/" + companyId, { headers: this.myHeaders() });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}