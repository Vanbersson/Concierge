package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.UserRole;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;

public record UserDto(
        Company company,
        Resale resale,
        Integer id,
        StatusEnabledDisabledEnum status,
        String name,
        String login,
        String password,
        String email,
        String cellphone,
        UserRole role) {
}
