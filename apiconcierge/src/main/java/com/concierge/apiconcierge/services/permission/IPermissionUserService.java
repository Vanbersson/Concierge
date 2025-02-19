package com.concierge.apiconcierge.services.permission;

import java.util.List;

public interface IPermissionUser {

    String save(PermissionUser permission);

    List<PermissionUser> filterPermissionUser(Integer userId);

    String deletePermissionsUser(Integer userId);

}
