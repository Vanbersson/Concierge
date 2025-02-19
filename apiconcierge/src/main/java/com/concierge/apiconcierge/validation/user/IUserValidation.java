package com.concierge.apiconcierge.validation.user;

import com.concierge.apiconcierge.models.user.User;

import java.util.List;
import java.util.Map;

public interface IUserValidation {
    String save(User user);

    String update(User user);

    String filterId(Integer id);

    String filterRoleId(Integer roleId);

    String filterEmail(String email);

}
