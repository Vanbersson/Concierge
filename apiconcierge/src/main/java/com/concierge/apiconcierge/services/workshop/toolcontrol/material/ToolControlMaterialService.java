package com.concierge.apiconcierge.services.workshop.toolcontrol.material;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlKitMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlKitMecRepository;
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

    @Autowired
    IToolControlKitMecRepository repositoryKitMec;

    @SneakyThrows
    @Override
    public Map<String, Object> save(ToolControlMaterial mat) {
        try {
            String message = this.validation.save(mat);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                mat.setId(null);
                mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                mat.setQuantityAvailableKit(mat.getQuantityAccountingKit());
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
                ToolControlMaterial resultRole = this.calQuantity(mat);

                //Loan
                if (resultRole.getQuantityAccountingLoan() < resultRole.getQuantityAvailableLoan() || resultRole.getQuantityAvailableLoan() < 0)
                    throw new ToolControlException("Quantity error.");

                ToolControlMaterial resultSave = this.repository.save(resultRole);
                return this.loadMat(resultSave);
            } else {
                throw new ToolControlException(message);
            }
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private ToolControlMaterial calQuantity(ToolControlMaterial mat) {

        if (mat.getType().equals(TypeRequest.Loan)) {
            float quantityLoan = (float) this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
                    .stream()
                    .mapToDouble(ToolControlMatMec::getDeliveryQuantity)
                    .sum();
            mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantityLoan);
        } else if (mat.getType().equals(TypeRequest.Kit)) {
//            float quantityKit = (float) this.repositoryKitMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
//                    .stream()
//                    .mapToDouble(ToolControlKitMec::getQuantityReq)
//                    .sum();
//            mat.setQuantityAvailableKit(mat.getQuantityAccountingKit() - quantityKit);
        } else if (mat.getType().equals(TypeRequest.Ambos)) {
            float quantityLoan = (float) this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
                    .stream()
                    .mapToDouble(ToolControlMatMec::getDeliveryQuantity)
                    .sum();
            mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantityLoan);

//            float quantityKit = (float) this.repositoryKitMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
//                    .stream()
//                    .mapToDouble(ToolControlKitMec::getQuantityReq)
//                    .sum();
//            mat.setQuantityAvailableKit(mat.getQuantityAccountingKit() - quantityKit);
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
        map.put("numberCA",mat.getNumberCA());
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
