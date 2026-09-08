package com.concierge.apiconcierge.services.workshop.toolcontrol.material;

import com.concierge.apiconcierge.exceptions.workshop.toolcontrol.ToolControlException;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlCategory;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlKitMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMatMec;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeCategory;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlCategoryRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlKitMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMatMecRepository;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlMaterialRepository;
import com.concierge.apiconcierge.services.workshop.toolcontrol.category.IToolControlCategoryService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.material.IToolControlMaterialValidation;
import com.concierge.apiconcierge.validation.workshop.toolcontrol.material.ToolControlMaterialValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ToolControlMaterialService implements IToolControlMaterialService {

    @Autowired
    private IToolControlMaterialRepository repository;

    @Autowired
    private IToolControlMaterialValidation validation;

    @Autowired
    private IToolControlMatMecRepository repositoryMatMec;

    @Autowired
    private IToolControlKitMecRepository repositoryKitMec;

    @Autowired
    private IToolControlCategoryRepository categoryRepository;

    @SneakyThrows
    @Override
    public MessageResponse save(ToolControlMaterial mat) {
        try {
            MessageResponse response = this.validation.save(mat);
            if (response.getStatus().equals(ConstantsMessage.SUCCESS)) {
                mat.setId(null);
                mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                mat.setQuantityAvailableKit(mat.getQuantityAccountingKit());
                ToolControlMaterial resultMat = this.repository.save(mat);
                response.setData(resultMat);
            }
            return response;
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(ToolControlMaterial mat) {
        try {
            MessageResponse response = this.validation.update(mat);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                ToolControlMaterial resultSaveMat;
                ToolControlCategory category = this.categoryRepository.filterId(mat.getCompanyId(), mat.getResaleId(), mat.getCategoryId());
                if (category.getType() == TypeCategory.Ferramenta) {
                    if (mat.getType() == TypeRequest.Loan) {
                        //Emprestimo
                        resultSaveMat = this.calQuantityAvailableMatMec(mat);
                        this.repository.save(resultSaveMat);
                        response.setData(resultSaveMat);
                    } else if (mat.getType() == TypeRequest.Kit) {
                        //Kit mecânico
                    } else if (mat.getType() == TypeRequest.Ambos) {
                        //Ambos
                        resultSaveMat = this.calQuantityAvailableMatMec(mat);
                        this.repository.save(resultSaveMat);
                        response.setData(resultSaveMat);
                    }
                } else if (category.getType() == TypeCategory.EPI) {
                    //Epi não alterar a quantidade disponivel
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                    this.repository.save(mat);
                    response.setData(mat);
                } else if (category.getType() == TypeCategory.Uniforme) {
                    //Uniforme não altera a quantidade disponivel
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                    this.repository.save(mat);
                    response.setData(mat);
                } else if (category.getType() == TypeCategory.Outro) {
                    resultSaveMat = this.calQuantityAvailableMatMec(mat);
                    this.repository.save(resultSaveMat);
                    response.setData(resultSaveMat);
                }
            }
            return response;
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer id) {
        try {
            MessageResponse response = this.validation.filterId(companyId, resaleId, id);
            if (response.getStatus().equals(ConstantsMessage.SUCCESS)) {
                ToolControlMaterial resultMat = this.repository.filterId(companyId, resaleId, id);
                response.setData(resultMat);
            }
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @SneakyThrows
    private ToolControlMaterial calQuantityAvailableMatMec(ToolControlMaterial mat) {
        BigDecimal quantityLoan = this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
                .stream()
                .map(ToolControlMatMec::getDeliveryQuantity)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal quantityAvailable = mat.getQuantityAccountingLoan().subtract(quantityLoan);

        if (quantityAvailable.compareTo(BigDecimal.ZERO) < 0) {
            throw new ToolControlException("Quantidade contabil menor que a requisitada.");
        }
        mat.setQuantityAvailableLoan(quantityAvailable);
        return mat;
//        BigDecimal quantityLoan = this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
//                .stream()
//                .mapToDouble(ToolControlMatMec::getDeliveryQuantity)
//                .sum();
//        BigDecimal qtd = mat.getQuantityAccountingLoan() - quantityLoan;
//        if (qtd < 0.0) {
//            throw new ToolControlException("Quantidade contabil menor que a requisitada.");
//        }
//        mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantityLoan);
//        return mat;
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAll(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.listAll(companyId, resaleId);
            if (response.getStatus().equals(ConstantsMessage.SUCCESS)) {
                List<ToolControlMaterial> list = this.repository.listAll(companyId, resaleId);
                List<Map<String, Object>> result = new ArrayList<>();
                for (ToolControlMaterial item : list) {
                    result.add(this.loadMat(item));
                }
                return result;
            }
            return List.of();
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<Map<String, Object>> listAllEnabled(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.listAllEnabled(companyId, resaleId);
            if (response.getStatus().equals(ConstantsMessage.SUCCESS)) {
                List<ToolControlMaterial> list = this.repository.listAllEnabled(companyId, resaleId);
                List<Map<String, Object>> result = new ArrayList<>();
                for (ToolControlMaterial item : list) {
                    result.add(this.loadMat(item));
                }
                return result;
            }
            return List.of();
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    private Map<String, Object> loadMat(ToolControlMaterial mat) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", mat.getId());
        map.put("status", mat.getStatus());
        map.put("description", mat.getDescription());
        map.put("categoryId", mat.getCategoryId());
        map.put("quantityAvailableLoan", mat.getQuantityAvailableLoan());
        map.put("quantityAvailableKit", mat.getQuantityAvailableKit());
        map.put("validityDay", mat.getValidityDay());
        return map;
    }
}
