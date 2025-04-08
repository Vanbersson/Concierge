package com.concierge.apiconcierge.validation.budget.service;

import com.concierge.apiconcierge.models.budget.BudgetService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class BudgetServiceValidation implements IBudgetServiceValidation {
    @Override
    public String save(BudgetService budgetService) {
        if (budgetService.getCompanyId() == null || budgetService.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (budgetService.getResaleId() == null || budgetService.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(BudgetService budgetService) {
        if (budgetService.getCompanyId() == null || budgetService.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (budgetService.getResaleId() == null || budgetService.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (budgetService.getId() == null)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listServices(Integer companyId, Integer resaleId, Integer budgetId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (budgetId == null || budgetId == 0)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String delete(BudgetService budgetService) {
        if (budgetService.getCompanyId() == null || budgetService.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (budgetService.getResaleId() == null || budgetService.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (budgetService.getId() == null)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAllDiscount(BudgetService budgetService) {
        if (budgetService.getCompanyId() == null || budgetService.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (budgetService.getResaleId() == null || budgetService.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (budgetService.getId() == null)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }
}
