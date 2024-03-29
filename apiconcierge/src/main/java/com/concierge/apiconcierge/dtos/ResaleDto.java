package com.concierge.apiconcierge.dtos;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResaleDto(
       @NotBlank Integer companyId,
        Integer id,
       StatusEnableDisable status,
        String name,
        String cnpj,

        String email,

        String cellphone,

        String phone,

        String state,

        String city,

        String zipCode,

        String address,

        String addressNumber

) {
}
