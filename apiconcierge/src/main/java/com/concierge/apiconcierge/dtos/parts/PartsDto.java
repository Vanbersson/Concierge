package com.concierge.apiconcierge.dtos.parts;

import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public record PartsDto(Integer companyId,
                       Integer resaleId,
                       Integer id,
                       StatusEnableDisable status,
                       String code,
                       String description,
                       float qtdAvailable,
                       float qtdAccounting,
                       String unitMeasure,
                       float price,
                       String locationStreet,
                       String locationBookcase,
                       String locationShelf,
                       Date dateLastEntry) {
}