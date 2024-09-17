package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;

public record CompanyDto(
        Integer id,
        StatusEnableDisable status,
        String name,
        String cnpj,
        String email,
        String cellphone,
        String phone,
        String zipCode,
        String state,
        String city,
        String neighborhood,
        String address,
        String addressNumber,
        String addressComplement
) {
}
