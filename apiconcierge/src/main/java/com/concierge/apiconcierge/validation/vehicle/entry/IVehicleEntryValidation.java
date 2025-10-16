package com.concierge.apiconcierge.validation.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsPlacaDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.VehicleEntryDto;
import com.concierge.apiconcierge.dtos.vehicle.exit.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;

public interface IVehicleEntryValidation {
    public String save(VehicleEntry vehicle);
    public MessageResponse update(VehicleEntry vehicle);
    public String exit(VehicleExitSaveDto dataExit);
    public MessageResponse addAuthExit(VehicleEntry vehicle, AuthExitDto authExitDto);
    public MessageResponse deleteAuthExit1(VehicleEntry vehicle, AuthExitDto authExitDto);
    public MessageResponse deleteAuthExit2(VehicleEntry vehicle, AuthExitDto authExitDto);
    public String existsPlaca(ExistsPlacaDto placa);
}
