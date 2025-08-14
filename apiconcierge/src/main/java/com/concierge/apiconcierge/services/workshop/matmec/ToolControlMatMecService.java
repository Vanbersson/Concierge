package com.concierge.apiconcierge.services.workshop.matmec;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.matmec.ToolControlMatMecValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


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
                float quant = matMec.getDeliveryQuantity();
                for (int i = 0; i < quant; i++) {
                    ToolControlMatMec newMatMec = new ToolControlMatMec();
                    newMatMec.setCompanyId(matMec.getCompanyId());
                    newMatMec.setResaleId(matMec.getResaleId());
                    newMatMec.setRequestId(matMec.getRequestId());
                    newMatMec.setDeliveryUserId(matMec.getDeliveryUserId());
                    newMatMec.setDeliveryUserName(matMec.getDeliveryUserName());
                    newMatMec.setDeliveryDate(matMec.getDeliveryDate());
                    newMatMec.setDeliveryQuantity(1);
                    newMatMec.setDeliveryInformation(matMec.getDeliveryInformation());
                    newMatMec.setReturnUserId(null);
                    newMatMec.setReturnUserName("");
                    newMatMec.setReturnDate(null);
                    newMatMec.setReturnQuantity(0);
                    newMatMec.setReturnInformation("");
                    newMatMec.setMaterialId(matMec.getMaterialId());
                    newMatMec.setMaterialDescription(matMec.getMaterialDescription());
                    newMatMec.setMaterialNumberCA(matMec.getMaterialNumberCA());

                    ToolControlMatMec resultSave = this.repository.save(newMatMec);
                }
                String resultMessage = this.updateQuantityMaterial(matMec, "Loan");
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

    private String updateQuantityMaterial(ToolControlMatMec matMec, String type) {
        List<ToolControlMatMec> mats = this.repository.filterMatIdDevPend(matMec.getCompanyId(), matMec.getResaleId(), matMec.getMaterialId());
        ToolControlMaterial material = this.materialRepository.filterId(matMec.getCompanyId(), matMec.getResaleId(), matMec.getMaterialId());
        if (type.equals("Loan")) {
            material.setQuantityAvailableLoan(material.getQuantityAccountingLoan() - mats.size());
        } else if (type.equals("Return")) {
            material.setQuantityAvailableLoan(material.getQuantityAvailableLoan() + matMec.getReturnQuantity());
        }
        this.materialRepository.save(material);
        return ConstantsMessage.SUCCESS;
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

    @SneakyThrows
    @Override
    public List<Map<String, Object>> filterRequestId(Integer companyId, Integer resaleId, Integer requestId) {
        try {
            String message = this.validation.filterRequestId(companyId, resaleId, requestId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<ToolControlMatMec> resultList = this.repository.filterRequestId(companyId, resaleId, requestId);
                List<Map<String, Object>> list = new ArrayList<>();
                for (ToolControlMatMec item : resultList) {
                    list.add(this.loadMatMec(item));
                }
                return list;
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

        map.put("deliveryUserId", matMec.getDeliveryUserId());
        map.put("deliveryUserName", matMec.getDeliveryUserName());
        map.put("deliveryDate", matMec.getDeliveryDate());
        map.put("deliveryQuantity", matMec.getDeliveryQuantity());
        map.put("deliveryInformation", matMec.getDeliveryInformation());

        map.put("returnUserId", matMec.getReturnUserId() != null ? matMec.getReturnUserId() : 0);
        map.put("returnUserName", matMec.getReturnUserName());
        map.put("returnDate", matMec.getReturnDate() != null ? matMec.getReturnDate() : "");
        map.put("returnQuantity", matMec.getReturnQuantity());
        map.put("returnInformation", matMec.getReturnInformation());

        map.put("materialId", matMec.getMaterialId());
        map.put("materialDescription", matMec.getMaterialDescription());
        map.put("materialNumberCA", matMec.getMaterialNumberCA());

        return map;
    }
}
