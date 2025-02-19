package com.concierge.apiconcierge.services.permission;

import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionUser implements IPermissionUser{
    @Autowired
    IPermissionUserRepository repository;

    @Override
    public String save(PermissionUser permission) {
        try {

        }catch (Exception ex){

        }
        return null;
    }

    @Override
    public List<PermissionUser> filterPermissionUser(Integer userId) {
        return null;
    }

    @Override
    public String deletePermissionsUser(Integer userId) {
        return null;
    }
}
