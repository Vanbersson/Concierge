package com.concierge.apiconcierge.validation.permission;

import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.services.permission.PermissionUserService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class PermissionUserValidation implements IPermissionUserValidation {
    @Override
    public String save(PermissionUser permission) {
        if (permission.getCompanyId() == null || permission.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (permission.getResaleId() == null || permission.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (permission.getUserId() == null || permission.getUserId() == 0)
            return ConstantsMessage.ERROR_USER_ID;
        if (permission.getPermissionId() == null || permission.getPermissionId() == 0)
            return ConstantsMessage.ERROR_PERMISSION_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterPermissionUser(Integer userId) {
        if (userId == null || userId == 0)
            return ConstantsMessage.ERROR_USER_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deletePermissionsUser(Integer userId) {
        if (userId == null || userId == 0)
            return ConstantsMessage.ERROR_USER_ID;
        return ConstantsMessage.SUCCESS;
    }
}
