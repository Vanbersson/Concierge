package com.concierge.apiconcierge.services.menu;

import com.concierge.apiconcierge.models.menu.MenuUser;

import java.util.List;
import java.util.Map;

public interface IMenuUserService {

    public String save(MenuUser menu);

    public String update(MenuUser menu);

    public List<Object> filterMenus(MenuUser menu);

    public String deleteMenu(MenuUser menu);
}
