package com.concierge.apiconcierge.services.workshop.matmec;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlRequest;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeMaterial;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlRequestRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.matmec.ToolControlMatMecValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ToolControlMatMecService implements IToolControlMatMecService {

    @Autowired
    IToolControlMatMecRepository repository;

    @Autowired
    ToolControlMatMecValidation validation;

    @Autowired
    IToolControlMaterialRepository materialRepository;

    @SneakyThrows
    @Override
    public String save(ToolControlMatMec matMec) {
        try {
            String message = this.validation.save(matMec);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                float quant = matMec.getQuantityReq();
                for (int i = 0; i < quant; i++) {
                    ToolControlMatMec newMatMec = new ToolControlMatMec();
                    newMatMec.setCompanyId(matMec.getCompanyId());
                    newMatMec.setResaleId(matMec.getResaleId());
                    newMatMec.setRequestId(matMec.getRequestId());
                    newMatMec.setQuantityReq(1);
                    newMatMec.setQuantityRet(0);
                    newMatMec.setUserIdRet(null);
                    newMatMec.setDateRet(null);
                    newMatMec.setInformationRet("");
                    newMatMec.setMaterialId(matMec.getMaterialId());
                    ToolControlMatMec resultSave = this.repository.save(newMatMec);
                }

                String resultMessage = this.updateQuantityMaterial(matMec, "Loan");
                if (!ConstantsMessage.SUCCESS.equals(resultMessage)) {
                    //Error
                }
                return ConstantsMessage.SUCCESS;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private String updateQuantityMaterial(ToolControlMatMec matMec, String type) {
        List<ToolControlMatMec> mats = this.repository.filterMatIdDevPend(matMec.getCompanyId(), matMec.getResaleId(), matMec.getMaterialId());
        ToolControlMaterial material = this.materialRepository.filterId(matMec.getCompanyId(), matMec.getResaleId(), matMec.getMaterialId());
        if (type.equals("Loan")) {
            material.setQuantityAvailableLoan(material.getQuantityAccountingLoan() - mats.size());
        } else if (type.equals("Return")) {
            material.setQuantityAvailableLoan(material.getQuantityAvailableLoan() + matMec.getQuantityRet());
        }
        this.materialRepository.save(material);
        return ConstantsMessage.SUCCESS;
    }

    @SneakyThrows
    @Override
    public String update(ToolControlMatMec matMec) {
        try {
            String message = this.validation.update(matMec);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(matMec);
                String resultMessage = this.updateQuantityMaterial(matMec, "Return");
                if (!ConstantsMessage.SUCCESS.equals(resultMessage)) {
                    //Error
                }
                return ConstantsMessage.SUCCESS;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> filterId(Integer companyId, Integer resaleId, UUID id) {
        try {
            String message = this.validation.filterId(companyId, resaleId, id);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                ToolControlMatMec matmec = this.repository.filterId(companyId, resaleId, id);
                if (matmec == null)
                    throw new ToolControlException("Material not found.");

                return this.loadMatMec(matmec);
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @Override
    public List<Map<String, Object>> filterMatIdDevPend(Integer companyId, Integer resaleId, Integer materialId) {
        return null;
    }

    @Override
    public List<Map<String, Object>> filterMecIdDevPend(Integer companyId, Integer resaleId, Integer mechanicId) {
        return null;
    }

    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        return null;
    }

    @Override
    public List<Map<String, Object>> listAllDevPend(Integer companyId, Integer resaleId) {
        return null;
    }

    @Override
    public List<Map<String, Object>> listAllDevComp(Integer companyId, Integer resaleId) {
        return null;
    }

    private Map<String, Object> loadMatMec(ToolControlMatMec matMec) {
        Map<String, Object> map = new HashMap<>();
        map.put("companyId", matMec.getCompanyId());
        map.put("resaleId", matMec.getResaleId());
        map.put("id", matMec.getId());
        map.put("requestId", matMec.getRequestId());
        map.put("quantityReq", matMec.getQuantityReq());
        map.put("quantityRet", matMec.getQuantityRet());
        map.put("userIdRet", matMec.getUserIdRet() != null ? matMec.getUserIdRet() : "");
        map.put("dateRet", matMec.getDateRet() != null ? matMec.getDateRet() : "");
        map.put("informationRet", matMec.getInformationRet());
        map.put("materialId", matMec.getMaterialId());
        return map;
    }
}
