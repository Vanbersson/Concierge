package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.resales.Resale;
import com.concierge.apiconcierge.models.role.RoleEnum;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;

public record UserRoleDto(
        Company company,
        Resale resale,
        Integer id,
        StatusEnabledDisabledEnum status,
        String description,
        RoleEnum role) {
}
