package com.concierge.apiconcierge.validation.workshop.toolcontrol.matmec;

import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;

public interface IToolControlMatMecValidation {
    String save(ToolControlMatMec matMec);

    String update(ToolControlMatMec matMec);

    String filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId);

    String filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId);

    String listAll(Integer companyId, Integer resaleId);

    String listAllDevPend(Integer companyId, Integer resaleId);

    String listAllDevComp(Integer companyId, Integer resaleId);
}
