package com.concierge.apiconcierge.validation.menu;

import com.concierge.apiconcierge.models.menu.MenuUser;

import java.util.List;
import java.util.Map;

public interface IMenuUserValidation {
    public String save(MenuUser menu);

    public String update(MenuUser menu);

    public void filterMenus();
}
