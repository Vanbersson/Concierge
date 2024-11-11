package com.concierge.apiconcierge.services.budget;

import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.repositories.budget.IBudgetRepository;
import com.concierge.apiconcierge.repositories.vehicle.IVehicleEntryRepository;
import com.concierge.apiconcierge.validation.budget.BudgetValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class BudgetService implements IBudgetService {
    private static final String SUCCESS = "success.";
    private final String NOTFOUND = "Not Exists.";

    @Autowired
    private IBudgetRepository repository;

    @Autowired
    private BudgetValidation validation;

    @Autowired
    private IVehicleEntryRepository repositoryVehicleEntry;

    @SneakyThrows
    @Override
    public Integer save(Integer vehicleEntryId) {
        Budget result;
        try {
            Optional<VehicleEntry> vehicle = this.repositoryVehicleEntry.findById(vehicleEntryId);
            if (vehicle.isEmpty())
                throw new BudgetException("Unauthorized.");

            VehicleEntry vehicleEntry = vehicle.get();
            String message = this.validation.save(vehicleEntry);

            if (message.equals(SUCCESS)) {
                Budget budget = new Budget();
                budget.setCompanyId(vehicleEntry.getCompanyId());
                budget.setResaleId(vehicleEntry.getResaleId());
                budget.setStatus(StatusBudgetEnum.naoEnviado);
                budget.setDateGeneration(new Date());
                budget.setVehicleEntryId(vehicleEntry.getId());
                budget.setIdUserAttendant(vehicleEntry.getIdUserAttendant());
                budget.setClientCompanyId(vehicleEntry.getClientCompanyId());
                budget.setTypePayment("");
                budget.setNameResponsible("");
                budget.setInformation("");
                result = this.repository.save(budget);

                //alterar o status do orçamento na entrada de veículo
                vehicleEntry.setBudgetStatus(StatusBudgetEnum.naoEnviado);
                this.repositoryVehicleEntry.save(vehicleEntry);
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
        return result.getId();
    }

    @SneakyThrows
    @Override
    public boolean update(Budget budget) {
        try {
            String message = this.validation.update(budget);
            if (message.equals(SUCCESS)) {
                this.repository.save(budget);
                return true;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }
    @SneakyThrows
    @Override
    public Map<String,Object> filterVehicleId(Integer vehicleId) {
        try {
            Budget budget = this.repository.findByVehicleEntryId(vehicleId);
            if (budget == null)
                throw new BudgetException(NOTFOUND);
            return  this.loadBudget(budget) ;
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    private Map<String,Object> loadBudget(Budget budget){

        Map<String,Object> map = new HashMap<>();
        map.put("companyId",budget.getCompanyId());
        map.put("resaleId",budget.getResaleId());
        map.put("id",budget.getId());
        map.put("vehicleEntryId",budget.getVehicleEntryId());
        map.put("status",budget.getStatus());
        map.put("dateGeneration",budget.getDateGeneration());
        if(budget.getDateValidation() == null){
            map.put("dateValidation","");
        }else{
            map.put("dateValidation",budget.getDateValidation());
        }
        if(budget.getDateAuthorization() == null){
            map.put("dateAuthorization","");
        }else{
            map.put("dateAuthorization",budget.getDateAuthorization());
        }
        map.put("nameResponsible",budget.getNameResponsible());
        map.put("typePayment",budget.getTypePayment());
        map.put("idUserAttendant",budget.getIdUserAttendant());
        map.put("clientCompanyId",budget.getClientCompanyId());
        map.put("information",budget.getInformation());

        return map;
    }

}