package com.concierge.apiconcierge.dtos.user;

import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import com.concierge.apiconcierge.models.user.UserRoleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.UUID;

public record UserDto(
        @NotNull Integer companyId,
        @NotNull Integer resaleId,
        Integer id,
        @NotNull StatusEnableDisable status,
        @NotBlank  String name,
        @NotBlank String email,
        @NotBlank String password,
        @NotBlank String cellphone,

        Integer limitDiscount,
        byte[] photo,
        @NotNull Integer roleId,
        @NotBlank String roleDesc,
        @NotNull UserRoleEnum roleFunc,

        Date lastSession) {
}
