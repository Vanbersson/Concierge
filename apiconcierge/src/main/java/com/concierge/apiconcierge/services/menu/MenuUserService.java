package com.concierge.apiconcierge.services.menu;

import com.concierge.apiconcierge.exceptions.menu.MenuUserException;
import com.concierge.apiconcierge.models.menu.MenuUser;
import com.concierge.apiconcierge.repositories.menu.IMenuUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.menu.MenuUserValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MenuUserService implements IMenuUserService {

    @Autowired
    IMenuUserRepository repository;
    @Autowired
    MenuUserValidation validation;

    @SneakyThrows
    @Override
    public String save(MenuUser menu) {

        try {

            String message = this.validation.save(menu);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                menu.setId(null);

                this.repository.save(menu);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new MenuUserException(message);
            }
        } catch (Exception ex) {
            throw new MenuUserException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public String update(MenuUser menu) {
        try {
            String message = this.validation.update(menu);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                this.repository.save(menu);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new MenuUserException(message);
            }
        } catch (Exception ex) {
            throw new MenuUserException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Object> filterMenus(MenuUser menu) {
        try {
            String message = this.validation.filterMenus(menu);

            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<MenuUser> list = this.repository.listMenus(menu.getCompanyId(), menu.getResaleId(), menu.getUserId());

                List<Object> keys = new ArrayList<>();
                for (int a = 0; a < list.size(); a++) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("key", list.get(a).getMenuId());
                    keys.add(map);
                }
                return keys;
            } else {
                throw new MenuUserException(message);
            }
        } catch (Exception ex) {
            throw new MenuUserException(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public String deleteMenu(MenuUser menu) {
        try {

            String message = this.validation.deleteMenus(menu);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.deleteMenu(menu.getCompanyId(), menu.getResaleId(), menu.getUserId());
                return ConstantsMessage.SUCCESS;
            } else {
                throw new MenuUserException(message);
            }
        } catch (Exception ex) {
            throw new MenuUserException(ex.getMessage());

        }
    }
}
