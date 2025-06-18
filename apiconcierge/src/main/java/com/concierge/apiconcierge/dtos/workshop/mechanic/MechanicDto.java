package com.concierge.apiconcierge.dtos.workshop.mechanic;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;

public record MechanicDto(Integer companyId,
                          Integer resaleId,
                          Integer id,
                          StatusEnableDisable status,
                          String name,
                          Integer codePassword,
                          byte[] photo) {}
