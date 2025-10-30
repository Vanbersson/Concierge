package com.concierge.apiconcierge.services.vehicle.entry;

import com.concierge.apiconcierge.dtos.vehicle.entry.AuthExitDto;
import com.concierge.apiconcierge.dtos.vehicle.entry.ExistsPlacaDto;
import com.concierge.apiconcierge.dtos.vehicle.exit.VehicleExitSaveDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.vehicle.entry.VehicleEntry;

import java.util.List;
import java.util.Map;

public interface IVehicleEntryService {

    public Integer save(VehicleEntry vehicle,String userEmail);

    public MessageResponse update(VehicleEntry vehicle,String userEmail);

    public MessageResponse exit(VehicleExitSaveDto dataExit,String userEmail);

    public List<Object> allAuthorized(Integer companyId, Integer resaleId);

    public List<Object> allPendingAuthorization(Integer companyId, Integer resaleId);

    public List<Object> allEntry();

    public Map<String, Object> filterId(Integer companyId, Integer resaleId,Integer id);

    public Map<String, Object> filterPlaca(Integer companyId, Integer resaleId, String placa);

    public String existsPlaca(ExistsPlacaDto placa);

    public MessageResponse addAuthExit(AuthExitDto authExitDto);

    public MessageResponse deleteAuthExit1(AuthExitDto authExitDto);

    public MessageResponse deleteAuthExit2(AuthExitDto authExitDto);
}
