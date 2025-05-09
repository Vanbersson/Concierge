package com.concierge.apiconcierge.services.user;

import com.concierge.apiconcierge.models.user.User;

import java.util.List;
import java.util.Map;


public interface IUserService {

    Integer save(User user);

    String update(User user);

    List<Map<String, Object>> listAll(Integer companyId, Integer resaleId);

    Map<String, Object> filterId(Integer companyId, Integer resaleId,Integer id);

    List<Map<String, Object>> filterRoleId(Integer companyId, Integer resaleId,Integer roleId);

    Map<String, Object> filterEmail(Integer companyId, Integer resaleId,String email);
}
