package com.concierge.apiconcierge.repositories.menu;

import com.concierge.apiconcierge.models.menu.MenuUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface IMenuUserRepository extends JpaRepository<MenuUser, UUID> {

    @Query(
            value = "SELECT `company_id`, `resale_id`, `id`, `user_id`, `menu_id` FROM `tb_user_menu` WHERE `company_id` = ?1 and `resale_id`= ?2 and `user_id`=?3 and `menu_id`=?4",
            nativeQuery = true)
    MenuUser findMenu(Integer companyId, Integer resaleId, Integer userId, String menuId);

    @Query(
            value = "SELECT `company_id`, `resale_id`, `id`, `user_id`, `menu_id` FROM `tb_user_menu` WHERE `company_id` = ?1 and `resale_id`= ?2 and `user_id`=?3",
            nativeQuery = true)
    List<MenuUser> listMenus(Integer companyId, Integer resaleId, Integer userId);

    @Transactional
    @Modifying
    @Query(value = "delete from tb_user_menu where user_id=?1 ",nativeQuery = true)
    void deleteMenu(Integer userId);


}
