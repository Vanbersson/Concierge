package com.concierge.apiconcierge.models.workshop.toolcontrol.report;

import java.util.Date;
import java.util.UUID;

public interface IToolControlReport {

    Integer getCompanyId();

    Integer getResaleId();

    Integer getMecId();

    String getMecName();

    byte[] getMecPhoto();

    Integer getRequestId();

    Date getRequestDateReq();

    Integer getCategoryId();

    String getCategoryDesc();

    byte[] getMatMecId();

    Integer getMaterialId();

    String getMaterialDesc();

    byte[] getMaterialPhoto();

    Integer getMaterialQuantReq();

    String getMaterialInfReq();
}
