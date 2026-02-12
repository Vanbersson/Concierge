import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { ModelVehicle } from '../../models/vehicle-model/model-vehicle';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';

@Injectable({
    providedIn: 'root'
})
export class ShareWhatsAppService {
    constructor() { }

    /* Share vehicle data via WhatsApp */
    public shareVehicle(vehicle: VehicleEntry) {
        const uppercase = new UpperCasePipe();
        const datePipe = new DatePipe('pt-BR');
        //Alterar o fuso horário para o horário local
        /* vehicle.dateEntry = this.formatDateTime(new Date(vehicle.dateEntry));
        if (vehicle.dateExit)
            vehicle.dateExit = this.formatDateTime(new Date(vehicle.dateExit));
        if (vehicle.dateExitAuth1)
            vehicle.dateExitAuth1 = this.formatDateTime(new Date(vehicle.dateExitAuth1));
        if (vehicle.dateExitAuth2)
            vehicle.dateExitAuth2 = this.formatDateTime(new Date(vehicle.dateExitAuth2));

        const message = encodeURIComponent(`*Dados do Veículo*\n
          Código: ${vehicle.id}
          Placa: ${uppercase.transform(vehicle.placa)}
          Modelo: ${uppercase.transform(vehicle.modelDescription)}
          KM Entrada: ${vehicle.kmEntry}
          KM Saída: ${vehicle.kmExit}
          Empresa Código: ${vehicle.clientCompanyId == 0 ? "" : vehicle.clientCompanyId}
          Empresa Nome: ${vehicle.clientCompanyName}
          Consultor: ${uppercase.transform(vehicle.nameUserAttendant)}
          Consultor Obs.: ${vehicle.information == null ? "" : uppercase.transform(vehicle.information)}
          Data Entrada: ${datePipe.transform(vehicle.dateEntry, "dd/MM/yyyy HH:mm")}
          Data Saída: ${vehicle.dateExit == "" ? "" : datePipe.transform(vehicle.dateExit, "dd/MM/yyyy HH:mm")}
          Porteiro Entrada: ${uppercase.transform(vehicle.nameUserEntry)}
          Porteiro Obs.: ${vehicle.informationConcierge == null ? "" : uppercase.transform(vehicle.informationConcierge)}
          Porteiro Saída: ${vehicle.userNameExit == null ? "" : uppercase.transform(vehicle.userNameExit)}
          Motorista Entrada Código: ${vehicle.driverEntryId}
          Motorista Entrada Nome: ${uppercase.transform(vehicle.driverEntryName)}
          Motorista Saída Código: ${vehicle.driverExitId == 0 ? "" : vehicle.driverExitId}
          Motorista Saída Nome: ${vehicle.driverExitName == null ? "" : uppercase.transform(vehicle.driverExitName)}
          O.S.: ${vehicle.numServiceOrder}
          NFe: ${vehicle.numNfe}
          NFS-e: ${vehicle.numNfse}
          Auto 1ª: ${vehicle.nameUserExitAuth1} ${vehicle.dateExitAuth1 == "" ? "" : datePipe.transform(vehicle.dateExitAuth1, "dd/MM/yyyy HH:mm")}
          Auto 2ª: ${vehicle.nameUserExitAuth2} ${vehicle.dateExitAuth2 == "" ? "" : datePipe.transform(vehicle.dateExitAuth2, "dd/MM/yyyy HH:mm")}
          `);
        window.open(`https://wa.me/?text=${message}`, '_blank'); */
    }

    private formatDateTime(date: Date): string {
        const datePipe = new DatePipe('en-US');
        // Obtém o fuso horário local no formato ±hh:mm
        const tzOffset = -date.getTimezoneOffset();
        const sign = tzOffset >= 0 ? '+' : '-';
        const hours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
        const minutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
        const timezone = `${sign}${hours}:${minutes}`;
        // Formata a data e adiciona o fuso horário
        return datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + timezone;
    }

}