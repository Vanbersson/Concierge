package com.concierge.apiconcierge.models.workshop.toolcontrol.report;

import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.StatusRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeMaterial;

import java.util.Date;
import java.util.UUID;

public interface IToolControlReport {

    Integer getCompanyId();

    Integer getResaleId();

    Integer getRequestId();

    Integer getRequestStatus();

    Integer getRequestTypeMaterial();

    Integer getRequestUserId();

    Date getRequestDate();

    String getRequestInformation();

    Integer getCategoryId();

    String getCategoryDesc();



    byte[] getMatMecId();

    float getMatMecQuantityReq();

    float getMatMecQuantityRet();

    Integer getMatMecUserRet();

    Date getMatMecDateRet();

    String getMatMecInformationRet();

    Integer getMatMecMaterialId();

    String getMaterialDesc();

    byte[] getMaterialPhoto();

}
