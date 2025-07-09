package com.concierge.apiconcierge.services.workshop.matmec;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeMaterial;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.matmec.ToolControlMatMecValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> save(ToolControlMatMec matMec) {
        try {
            String message = this.validation.save(matMec);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                matMec.setId(null);
                matMec.setQuantityDev(0);
                matMec.setInformationDev("");

                ToolControlMatMec resultSave = this.repository.save(matMec);
                String resultMessage = this.updateQuantityMaterial(matMec);
                if (!ConstantsMessage.SUCCESS.equals(resultMessage)) {
                    //Error
                }

                Map<String, Object> map = new HashMap<>();
                map.put("id", resultSave.getId());
                return map;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private String updateQuantityMaterial(ToolControlMatMec matMec) {
        ToolControlMaterial mat = this.materialRepository.filterMaterial(matMec.getCompanyId(), matMec.getResaleId(), matMec.getMaterialId());
        if (mat == null)
            return "Material not found.";

        if (mat.getType().equals(TypeMaterial.Loan)) {
            if (mat.getQuantityAvailableLoan() < 1)
                return "Material not available.";
            mat.setQuantityAvailableLoan(mat.getQuantityAvailableLoan() - 1);
        } else if (mat.getType().equals(TypeMaterial.Kit)) {
//            if (mat.getQuantityAvailableKit() < 1)
//                return "Material not available.";
//            mat.setQuantityAvailableKit(mat.getQuantityAvailableKit() - 1);
        } else if (mat.getType().equals(TypeMaterial.Ambos)) {
            if (mat.getQuantityAvailableLoan() < 1)
                return "Material not available.";
            mat.setQuantityAvailableLoan(mat.getQuantityAvailableLoan() - 1);
        }

        this.materialRepository.save(mat);
        return ConstantsMessage.SUCCESS;
    }

    @SneakyThrows
    @Override
    public String update(ToolControlMatMec matMec) {
        try {
            String message = this.validation.update(matMec);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(matMec);
                return ConstantsMessage.SUCCESS;
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
}
