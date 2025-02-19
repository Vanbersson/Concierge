package com.concierge.apiconcierge.services.permission;

import com.concierge.apiconcierge.exceptions.permission.PermissionUserException;
import com.concierge.apiconcierge.models.permission.PermissionUser;
import com.concierge.apiconcierge.repositories.permission.IPermissionUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.permission.IPermissionUserValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionUserService implements IPermissionUserService {
    @Autowired
    IPermissionUserRepository repository;

    @Autowired
    IPermissionUserValidation validation;

    @SneakyThrows
    @Override
    public String save(PermissionUser permission) {
        try {
            String message = this.validation.save(permission);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                permission.setId(null);
                this.repository.save(permission);

                return ConstantsMessage.SUCCESS;
            } else {
                throw new PermissionUserException(message);
            }

        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public List<PermissionUser> filterPermissionUser(Integer userId) {
        try {
            String message = this.validation.filterPermissionUser(userId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.findByUserId(userId);
            } else {
                throw new PermissionUserException(message);
            }

        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String deletePermissionsUser(Integer userId) {
        try {
            String message = this.validation.deletePermissionsUser(userId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.deleteUser(userId);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new PermissionUserException(message);
            }
        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }
}
