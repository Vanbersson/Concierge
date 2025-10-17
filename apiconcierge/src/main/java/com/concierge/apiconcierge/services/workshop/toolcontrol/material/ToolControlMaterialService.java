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

    @Autowired
    IToolControlCategoryRepository categoryRepository;

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
                        response.setData(this.loadMat(resultSaveMat));
                    } else if (mat.getType() == TypeRequest.Kit) {
                        //Kit mecânico
                    } else if (mat.getType() == TypeRequest.Ambos) {
                        //Ambos
                        resultSaveMat = this.calQuantityAvailableMatMec(mat);
                        this.repository.save(resultSaveMat);
                        response.setData(this.loadMat(resultSaveMat));
                    }
                } else if (category.getType() == TypeCategory.EPI) {
                    //Epi não alterar a quantidade disponivel
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                    this.repository.save(mat);
                    response.setData(this.loadMat(mat));
                } else if (category.getType() == TypeCategory.Uniforme) {
                    //Uniforme não altera a quantidade disponivel
                    mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan());
                    this.repository.save(mat);
                    response.setData(this.loadMat(mat));
                } else if (category.getType() == TypeCategory.Outro) {
                    resultSaveMat = this.calQuantityAvailableMatMec(mat);
                    this.repository.save(resultSaveMat);
                    response.setData(this.loadMat(resultSaveMat));
                }
            }
            return response;
        } catch (Exception ex) {
            throw new ToolControlException(ex.getMessage());
        }
    }

    @SneakyThrows
    private ToolControlMaterial calQuantityAvailableMatMec(ToolControlMaterial mat) {
        float quantityLoan = (float) this.repositoryMatMec.filterMatIdDevPend(mat.getCompanyId(), mat.getResaleId(), mat.getId())
                .stream()
                .mapToDouble(ToolControlMatMec::getDeliveryQuantity)
                .sum();
        float qtd = mat.getQuantityAccountingLoan() - quantityLoan;
        if (qtd < 0.0) {
            throw new ToolControlException("Quantidade contabil menor que a requisitada.");
        }
        mat.setQuantityAvailableLoan(mat.getQuantityAccountingLoan() - quantityLoan);
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
        map.put("numberCA", mat.getNumberCA());
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
