package com.concierge.apiconcierge.services.user;

import com.concierge.apiconcierge.config.security.WebSecurityConfig;
import com.concierge.apiconcierge.exceptions.user.UserException;
import com.concierge.apiconcierge.models.user.User;
import com.concierge.apiconcierge.repositories.user.IUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.user.UserValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService implements IUserService {

    @Autowired
    IUserRepository repository;

    @Autowired
    UserValidation validation;

    @Autowired
    WebSecurityConfig security;

    @SneakyThrows
    @Override
    public Integer save(User user) {
        try {
            String message = this.validation.save(user);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                String encryptedPass = this.security.passwordEncoder().encode(user.getPassword());

                user.setId(null);
                user.setPassword(encryptedPass);

                User userResult = this.repository.save(user);
                return userResult.getId();
            } else {
                throw new UserException(message);
            }
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(User user) {

        try {
            String message = this.validation.update(user);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                User userResult = this.repository.filterEmail(user.getCompanyId(), user.getResaleId(), user.getEmail());
                user.setPassword(userResult.getPassword());

                this.repository.save(user);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new UserException(message);
            }
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            List<User> usersResult = this.repository.listAll(companyId, resaleId);

            List<Map<String, Object>> list = new ArrayList<>();
            for (User user : usersResult) {
                list.add(this.loadUser(user));
            }
            return list;
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterId(Integer companyId, Integer resaleId, Integer id) {
        try {
            String message = this.validation.filterId(companyId, resaleId, id);

            if (ConstantsMessage.SUCCESS.equals(message)) {
                User user = this.repository.findById(companyId, resaleId, id);
                return this.loadUser(user);
            } else {
                throw new UserException(message);
            }
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> filterRoleId(Integer companyId, Integer resaleId, Integer roleId) {

        try {
            String message = this.validation.filterRoleId(companyId, resaleId, roleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                List<User> usersResult = this.repository.findByRoleId(companyId, resaleId, roleId);

                List<Map<String, Object>> list = new ArrayList<>();
                for (User user : usersResult) {
                    list.add(this.loadUser(user));
                }
                return list;
            } else {
                throw new UserException(message);
            }
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterEmail(Integer companyId, Integer resaleId, String email) {

        try {
            String message = this.validation.filterEmail(companyId, resaleId, email);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                User userResult = this.repository.filterEmail(companyId, resaleId, email);
                if (userResult == null) return new HashMap<>();

                return this.loadUser(userResult);
            } else {
                throw new UserException(message);
            }
        } catch (Exception ex) {
            throw new UserException(ex.getMessage());
        }
    }

    private Map<String, Object> loadUser(User user) {
        Map<String, Object> map = new HashMap<>();

        map.put("companyId", user.getCompanyId());
        map.put("resaleId", user.getResaleId());
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("status", user.getStatus());
        map.put("email", user.getEmail());
        map.put("cellphone", user.getCellphone());
        map.put("limitDiscount", user.getLimitDiscount());
        map.put("roleId", user.getRoleId());
        map.put("roleDesc", user.getRoleDesc());
        map.put("roleFunc", user.getRoleFunc());
        if (user.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", user.getPhoto());
        }
        return map;
    }
}
