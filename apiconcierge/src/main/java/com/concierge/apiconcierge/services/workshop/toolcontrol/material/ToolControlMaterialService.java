package com.concierge.apiconcierge.services.workshop.toolcontrol.material;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeMaterial;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.material.ToolControlMaterialValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ToolControlMaterialService implements IToolControlMaterialService {

    @Autowired
    IToolControlMaterialRepository repository;

    @Autowired
    ToolControlMaterialValidation validation;

    @Autowired
    IToolControlMatMecRepository repositoryMatMec;

    @SneakyThrows
    @Override
    public Map<String, Object> save(ToolControlMaterial mat) {
        try {
            String message = this.validation.save(mat);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                mat.setId(null);

                if (mat.getType().equals(TypeMaterial.Loan)) {
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                } else if (mat.getType().equals(TypeMaterial.Kit)) {
                    mat.setQuantityAvailableKit(mat.getQuantityAccountingKit());
                } else if (mat.getType().equals(TypeMaterial.Ambos)) {
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                    mat.setQuantityAvailableKit(mat.getQuantityAccountingKit());
                }
                ToolControlMaterial resultMat = this.repository.save(mat);
                return this.loadMat(resultMat);
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public Map<String, Object> update(ToolControlMaterial mat) {
        try {
            String message = this.validation.update(mat);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                ToolControlMaterial resultRole = this.updateRole(mat);
                ToolControlMaterial resultSave = this.repository.save(resultRole);
                return this.loadMat(resultSave);
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private ToolControlMaterial updateRole(ToolControlMaterial mat) {

        float quantLoan = (float) this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
                .stream()
                .mapToDouble(ToolControlMatMec::getQuantityReq)
                .sum();

        //falta implementar quantidade de kit
        float quantKit = 0;

        if (mat.getType().equals(TypeMaterial.Loan)) {
            mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantLoan);
        } else if (mat.getType().equals(TypeMaterial.Kit)) {
            mat.setQuantityAvailableKit(mat.getQuantityAccountingKit() - quantKit);
        } else if (mat.getType().equals(TypeMaterial.Ambos)) {
            mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantLoan);
            mat.setQuantityAvailableKit(mat.getQuantityAccountingKit() - quantKit);
        }
        return mat;
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<ToolControlMaterial> list = this.repository.listAll(companyId, resaleId);
                List<Map<String, Object>> maps = new ArrayList<>();

                for (ToolControlMaterial mat : list) {
                    maps.add(this.loadMat(mat));
                }
                return maps;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAllEnabled(Integer companyId, Integer resaleId) {
        try {
            String message = this.validation.listAllEnabled(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<ToolControlMaterial> list = this.repository.listAllEnabled(companyId, resaleId);
                List<Map<String, Object>> maps = new ArrayList<>();

                for (ToolControlMaterial mat : list) {
                    maps.add(this.loadMat(mat));
                }
                return maps;
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private Map<String, Object> loadMat(ToolControlMaterial mat) {
        Map<String, Object> map = new HashMap<>();
        map.put("companyId", mat.getCompanyId());
        map.put("resaleId", mat.getResaleId());
        map.put("id", mat.getId());
        map.put("status", mat.getStatus());
        map.put("type", mat.getType());
        map.put("description", mat.getDescription());
        map.put("categoryId", mat.getCategoryId());
        map.put("quantityAccountingLoan", mat.getQuantityAccountingLoan());
        map.put("quantityAvailableLoan", mat.getQuantityAvailableLoan());
        map.put("quantityAccountingKit", mat.getQuantityAccountingKit());
        map.put("quantityAvailableKit", mat.getQuantityAvailableKit());
        map.put("validityDay", mat.getValidityDay());

        if (mat.getPhoto() == null) {
            map.put("photo", "");
        } else {
            map.put("photo", mat.getPhoto());
        }
        return map;
    }
}
