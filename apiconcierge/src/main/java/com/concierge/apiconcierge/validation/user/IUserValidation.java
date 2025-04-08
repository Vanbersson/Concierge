package com.concierge.apiconcierge.validation.user;

import com.concierge.apiconcierge.models.user.User;

import java.util.List;
import java.util.Map;

public interface IUserValidation {
    String save(User user);

    String update(User user);

    String filterId(Integer companyId, Integer resaleId, Integer id);

    String filterRoleId(Integer companyId, Integer resaleId, Integer roleId);

    String filterEmail(Integer companyId, Integer resaleId, String email);

}
