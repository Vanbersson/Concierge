package com.concierge.apiconcierge.validation.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.ExistsPlacaDto;
import com.concierge.apiconcierge.dtos.vehicle.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;

public interface IVehicleEntryValidation {
    public String save(VehicleEntry vehicle);
    public String update(VehicleEntry vehicle);
    public String exit(VehicleExitSaveDto dataExit);
    public String addAuthExit(VehicleEntry vehicle, AuthExitDto authExitDto);
    public String deleteAuthExit1(VehicleEntry vehicle, AuthExitDto authExitDto);
    public String deleteAuthExit2(VehicleEntry vehicle, AuthExitDto authExitDto);
    public String existsPlaca(ExistsPlacaDto placa);
}
