package com.concierge.apiconcierge.services.vehicle;

import com.concierge.apiconcierge.dtos.vehicle.AuthExit;
import com.concierge.apiconcierge.dtos.vehicle.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;

import java.util.List;
import java.util.Map;

public interface IVehicleEntryService {

    public Integer save(VehicleEntry vehicle);

    public String update(VehicleEntry vehicle);

    public String exit(VehicleExitSaveDto dataExit);

    public List<Object> allAuthorized();

    public List<Object> allPendingAuthorization();

    public List<Object> allEntry();

    public  Map<String, Object> filterId(Integer id);

    public  Map<String, Object> filterPlaca(String placa);

    public String NotExistsVehicle(String placa);

    public Map<String, Object> addAuthExit(AuthExit authExit);

    public String deleteAuthExit1(AuthExit authExit);

    public String deleteAuthExit2(AuthExit authExit);
}
