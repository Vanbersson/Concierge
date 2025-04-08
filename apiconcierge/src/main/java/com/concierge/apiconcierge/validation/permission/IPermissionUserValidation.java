package com.concierge.apiconcierge.validation.permission;

import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.services.permission.PermissionUserService;

public interface IPermissionUserValidation {
    String save(PermissionUser permission);

    String filterPermissionUser(Integer companyId, Integer resaleId,Integer userId);

    String deletePermissionsUser(Integer companyId, Integer resaleId,Integer userId);
}
