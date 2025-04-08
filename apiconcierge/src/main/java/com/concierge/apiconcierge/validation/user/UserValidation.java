package com.concierge.apiconcierge.validation.user;

import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.user.IUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserValidation implements IUserValidation {

    @Autowired
    IUserRepository repository;

    @Override
    public String save(User user) {
        if (user.getCompanyId() == null || user.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (user.getResaleId() == null || user.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (user.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (user.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (user.getPassword().isBlank())
            return ConstantsMessage.ERROR_PASSWORD;
        if (user.getRoleId() == null || user.getRoleId() == 0)
            return ConstantsMessage.ERROR_ROLE;
        if (user.getRoleDesc().isBlank())
            return ConstantsMessage.ERROR_ROLE;
        if (user.getRoleFunc() == null)
            return ConstantsMessage.ERROR_ROLE;
        if (user.getEmail().isBlank())
            return ConstantsMessage.ERROR_EMAIL;
        if (this.repository.filterEmail(user.getCompanyId(), user.getResaleId(), user.getEmail()) != null)
            return ConstantsMessage.ERROR_USER_EXISTS;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(User user) {
        if (user.getCompanyId() == null || user.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (user.getResaleId() == null || user.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (user.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (user.getId() == null || user.getId() == 0)
            return ConstantsMessage.ERROR_ID;
        if (user.getName().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (user.getRoleId() == null || user.getRoleId() == 0)
            return ConstantsMessage.ERROR_ROLE;
        if (user.getRoleDesc().isBlank())
            return ConstantsMessage.ERROR_ROLE;
        if (user.getRoleFunc() == null)
            return ConstantsMessage.ERROR_ROLE;
        if (user.getEmail().isBlank())
            return ConstantsMessage.ERROR_EMAIL;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterId(Integer companyId, Integer resaleId, Integer id) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (id == null || id == 0)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }


    @Override
    public String filterRoleId(Integer companyId, Integer resaleId, Integer roleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (roleId == null || roleId == 0)
            return ConstantsMessage.ERROR_ROLE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterEmail(Integer companyId, Integer resaleId, String email) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (email.isBlank())
            return ConstantsMessage.ERROR_EMAIL;
        return ConstantsMessage.SUCCESS;
    }
}
