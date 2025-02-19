package com.concierge.apiconcierge.validation.budget;

import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.models.vehicle.VehicleEntry;
import com.concierge.apiconcierge.models.vehicle.enums.VehicleYesNotEnum;
import com.concierge.apiconcierge.repositories.budget.IBudgetRepository;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.repositories.user.IUserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.util.ConstantsPermission;

@Service
public class BudgetValidation implements IBudgetValidation {

    @Autowired
    private IBudgetRepository repository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    IPermissionUserRepository permissionUser;

    private final String COMPANY = "Id not informed.";
    private final String RESALE = "Resale not informed.";
    private final String ID = "Id not informed.";
    private final String VEHICLE = "VehicleEntryId not informed.";
    private final String STATUS = "Status not informed.";

    private final String DATEGENERATION = "Date Generation not informed.";
    private final String DATEVALIDATION = "Date validation not informed.";
    private final String DATEAUTHORIZATION = "Date authorization not informed.";
    private final String NAMERESPONSIBLE = "Name responsible not informed.";
    private final String TYPEPAYMENT = "type payment not informed.";
    private final String ATTENDANT = "Attendant not informed.";
    private final String CLIENTCOMPANY = "ClientCompany not informed.";
    private final String SERVICEORDER ="Equal service order not.";
    private final String NOTFOUND = "Not Exists.";

    @Override
    public String save(VehicleEntry vehicle,String userEmail) {
        if (vehicle.getIdUserAttendant() == null || vehicle.getIdUserAttendant() == 0 || vehicle.getNameUserAttendant().isBlank())
            return ATTENDANT;
        if (vehicle.getClientCompanyId() == null || vehicle.getClientCompanyId() == 0 || vehicle.getClientCompanyName().isBlank())
            return CLIENTCOMPANY;
        if(vehicle.getServiceOrder() == VehicleYesNotEnum.not)
            return SERVICEORDER;

        User user = this.userRepository.findByEmail(userEmail);
        if(user.getId() != 1){
            PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(user.getId(), ConstantsPermission.BUDGET_NEW);
            if(permission == null)
                return ConstantsMessage.ERROR_PERMISSION;
        }

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(Budget budget,String userEmail) {

        Optional<Budget> b = this.repository.findById(budget.getId());
        if (b.isEmpty())
            return NOTFOUND;
        if (budget.getCompanyId() == null || budget.getCompanyId() == 0)
            return COMPANY;
        if (budget.getResaleId() == null || budget.getResaleId() == 0)
            return RESALE;
        if (budget.getId() == null || budget.getId() == 0)
            return ID;
        if (budget.getVehicleEntryId() == null || budget.getVehicleEntryId() == 0)
            return VEHICLE;
        if (budget.getStatus() == null)
            return STATUS;
        if (budget.getDateGeneration() == null)
            return DATEGENERATION;
        if (budget.getDateValidation() == null)
            return DATEVALIDATION;
        if (budget.getNameResponsible().isBlank())
            return NAMERESPONSIBLE;
        if (budget.getIdUserAttendant() == null || budget.getIdUserAttendant() == 0)
            return ATTENDANT;
        if (budget.getClientCompanyId() == null || budget.getClientCompanyId() == 0)
            return CLIENTCOMPANY;


        User user = this.userRepository.findByEmail(userEmail);
        if(user.getId() != 1){
            PermissionUser permission = this.permissionUser.findByUserIdAndPermissionId(user.getId(), ConstantsPermission.BUDGET_UPDATE);
            if(permission == null)
                return ConstantsMessage.ERROR_PERMISSION;
        }

        return ConstantsMessage.SUCCESS;
    }
}
