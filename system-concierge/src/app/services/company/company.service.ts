import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Company } from '../../models/company/Company';


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient, private storage: StorageService) { }


    public getCompanyFilterId$(id: number): Observable<Company> {
        return this.http.get<Company>(environment.apiuUrl + "/company/filter/id/" + id, { headers: this.myHeaders() });
    }

    private myHeaders(): HttpHeaders {
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storage.token,
        });
        return httpOptions;
    }

}