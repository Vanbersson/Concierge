package com.concierge.apiconcierge.services.permission;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.permission.PermissionUser;

import java.util.List;

public interface IPermissionUserService {

    MessageResponse save(PermissionUser permission);

    MessageResponse filterUser(Integer companyId, Integer resaleId, Integer userId);

    MessageResponse filterUserPermission(Integer companyId, Integer resaleId, Integer userId, Integer permissionId);

    MessageResponse deletePermissionsUser(Integer companyId, Integer resaleId, Integer userId);

}
