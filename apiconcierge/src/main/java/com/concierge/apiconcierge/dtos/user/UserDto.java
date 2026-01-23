package com.concierge.apiconcierge.dtos.user;

import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.user.UserRoleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.UUID;

public record UserDto(
        Integer companyId,
        Integer resaleId,
        Integer id,
        StatusEnableDisable status,
        String name,
        String email,
        String password,
        String cellphone,
        Integer limitDiscount,
        String photoUrl,
        Integer roleId,
        String roleDesc,
        UserRoleEnum roleFunc) {
}
