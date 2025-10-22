package com.concierge.apiconcierge.services.permission;

import com.concierge.apiconcierge.exceptions.permission.PermissionUserException;
import com.concierge.apiconcierge.models.message.MessageResponse;
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
    public MessageResponse save(PermissionUser permission) {
        try {
            MessageResponse response = this.validation.save(permission);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                permission.setId(null);
                this.repository.save(permission);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterUser(Integer companyId, Integer resaleId, Integer userId) {
        try {
            MessageResponse response = this.validation.filterUser(companyId, resaleId, userId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<PermissionUser> p = this.repository.listPermissionUser(companyId, resaleId, userId);
                if (p.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader(ConstantsMessage.ERROR);
                    response.setMessage("Permissões não encontrada.");
                    response.setData(null);
                    return response;
                }
                response.setData(p);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterUserPermission(Integer companyId, Integer resaleId, Integer userId, Integer permissionId) {
        try {
            MessageResponse response = this.validation.filterUserPermission(companyId, resaleId, userId, permissionId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                PermissionUser p = this.repository.findPermissionId(companyId, resaleId, userId, permissionId);
                if (p == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Permissão - " + permissionId);
                    response.setMessage(ConstantsMessage.NOT_PERMISSION);
                    response.setData(null);
                    return response;
                }
                response.setData(p);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse deletePermissionsUser(Integer companyId, Integer resaleId, Integer userId) {
        try {
            MessageResponse response = this.validation.deletePermissionsUser(companyId, resaleId, userId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                this.repository.deleteUser(companyId, resaleId, userId);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new PermissionUserException(ex.getMessage());
        }
    }
}
