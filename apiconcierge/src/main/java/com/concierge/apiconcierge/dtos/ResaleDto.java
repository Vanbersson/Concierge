package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.address.Address;
import com.concierge.apiconcierge.models.companies.Company;
import com.concierge.apiconcierge.models.status.StatusEnabledDisabledEnum;

public record ResaleDto(
        Company company,
        Integer id,
        StatusEnabledDisabledEnum status,
        String name,
        String cnpj,
        Address address
) {
}
