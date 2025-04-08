package com.concierge.apiconcierge.services.permission;

import com.concierge.apiconcierge.models.permission.PermissionUser;

import java.util.List;

public interface IPermissionUserService {

    String save(PermissionUser permission);

    List<PermissionUser> filterPermissionUser(Integer companyId, Integer resaleId, Integer userId);

    String deletePermissionsUser(Integer companyId, Integer resaleId,Integer userId);

}
