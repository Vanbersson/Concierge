package com.concierge.apiconcierge.validation.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;

import java.util.List;

public interface IVehicleEntryValidation {
    public String save(VehicleEntry vehicle);
    public String update(VehicleEntry vehicle);
    public String exit(VehicleEntry vehicle);
    public String addAuthExit(VehicleEntry vehicle, AuthExit authExit);
    public String deleteAuthExit1(VehicleEntry vehicle,AuthExit authExit);
    public String deleteAuthExit2(VehicleEntry vehicle, AuthExit authExit);
}
