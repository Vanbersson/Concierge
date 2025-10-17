package com.concierge.apiconcierge.validation.workshop.toolcontrol.material;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlCategory;
import com.concierge.apiconcierge.models.workshop.toolcontrol.ToolControlMaterial;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeCategory;
import com.concierge.apiconcierge.models.workshop.toolcontrol.enums.TypeRequest;
import com.concierge.apiconcierge.repositories.workshop.toolcontrol.IToolControlCategoryRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ToolControlMaterialValidation implements IToolControlMaterialValidation {

    @Autowired
    IToolControlCategoryRepository categoryRepository;

    @Override
    public String save(ToolControlMaterial mat) {
        if (mat.getCompanyId() == null || mat.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (mat.getResaleId() == null || mat.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (mat.getStatus() == null)
            return ConstantsMessage.ERROR_STATUS;
        if (mat.getDescription().isBlank())
            return ConstantsMessage.ERROR_NAME;
        if (mat.getCategoryId() == null || mat.getCategoryId() == 0)
            return "Category not informed.";
        if (mat.getQuantityAccountingLoan() < 0.0)
            return "Quantity Accounting Loan not informed.";
        if (mat.getQuantityAvailableLoan() < 0.0)
            return "Quantity Available Loan not informed.";
        if (mat.getQuantityAvailableLoan() > mat.getQuantityAccountingLoan())
            return "Error quantity.";

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public MessageResponse update(ToolControlMaterial mat) {
        MessageResponse response = new MessageResponse();
        if (mat.getCompanyId() == null || mat.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getResaleId() == null || mat.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getId() == null || mat.getId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Nome");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getCategoryId() == null || mat.getCategoryId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Categoria");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getType() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Tipo Requisição");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (mat.getQuantityAccountingLoan() < 0.0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empréstimo - Quantidade Contabil");
            response.setMessage("Menor que zero.");
            return response;
        }
        if (mat.getQuantityAvailableLoan() < 0.0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empréstimo - Quantidade Disponível");
            response.setMessage("Menor que zero.");
            return response;
        }
        ToolControlCategory category = this.categoryRepository.filterId(mat.getCompanyId(), mat.getResaleId(), mat.getCategoryId());
        if (category.getType() == TypeCategory.EPI || category.getType() == TypeCategory.Uniforme) {
            if (mat.getType() != TypeRequest.Loan) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setHeader("Tipo Requisição");
                response.setMessage("Tem que ser empréstimo.");
                return response;
            }
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Material");
        response.setMessage("Autorizado com sucesso.");
        return response;
    }

    @Override
    public String listAll(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listAllEnabled(Integer companyId, Integer resaleId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;

        return ConstantsMessage.SUCCESS;
    }
}
