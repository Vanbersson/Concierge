package com.concierge.apiconcierge.validation.menu;

import com.concierge.apiconcierge.models.menu.MenuUser;
import com.concierge.apiconcierge.repositories.menu.IMenuUserRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MenuUserValidation implements IMenuUserValidation {
    @Autowired
    IMenuUserRepository repository;

    @Override
    public String save(MenuUser menu) {

        if (menu.getCompanyId() == null || menu.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (menu.getResaleId() == null || menu.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (menu.getMenuId().isBlank())
            return ConstantsMessage.ERROR_MENU_ID;
        if (menu.getUserId() == null || menu.getUserId() == 0)
            return ConstantsMessage.ERROR_USER_ID;

        MenuUser response = repository.findMenu(menu.getCompanyId(), menu.getResaleId(), menu.getUserId(), menu.getMenuId());
        if (response != null)
            return ConstantsMessage.ERROR;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(MenuUser menu) {
        if (menu.getCompanyId() == null || menu.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (menu.getResaleId() == null || menu.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (menu.getId() == null)
            return ConstantsMessage.ERROR_ID;
        if (menu.getMenuId().isBlank())
            return ConstantsMessage.ERROR_MENU_ID;
        if (menu.getUserId() == null || menu.getUserId() == 0)
            return ConstantsMessage.ERROR_USER_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String filterMenus(MenuUser menu) {
        if (menu.getCompanyId() == null || menu.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (menu.getResaleId() == null || menu.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (menu.getUserId() == null || menu.getUserId() == 0)
            return ConstantsMessage.ERROR_USER_ID;

        return ConstantsMessage.SUCCESS;
    }
    @Override
    public String deleteMenus(MenuUser menu) {
        if (menu.getCompanyId() == null || menu.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (menu.getResaleId() == null || menu.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (menu.getUserId() == null || menu.getUserId() == 0)
            return ConstantsMessage.ERROR_USER_ID;

        return ConstantsMessage.SUCCESS;
    }
}
