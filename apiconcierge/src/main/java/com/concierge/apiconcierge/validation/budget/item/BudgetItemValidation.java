package com.concierge.apiconcierge.validation.budget.item;

import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.BudgetItem;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetItemValidation implements IBudgetItemValidation {
    @Override
    public String save(BudgetItem part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String update(BudgetItem part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (part.getId() == null)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String delete(BudgetItem part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (part.getId() == null)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String deleteAllDiscount(BudgetItem part) {
        if (part.getCompanyId() == null || part.getCompanyId() == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (part.getResaleId() == null || part.getResaleId() == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (part.getId() == null)
            return ConstantsMessage.ERROR_ID;
        return ConstantsMessage.SUCCESS;
    }

    @Override
    public String listItems(Integer companyId, Integer resaleId, Integer budgetId) {
        if (companyId == null || companyId == 0)
            return ConstantsMessage.ERROR_COMPANY;
        if (resaleId == null || resaleId == 0)
            return ConstantsMessage.ERROR_RESALE;
        if (budgetId == null || budgetId == 0)
            return ConstantsMessage.ERROR_ID;

        return ConstantsMessage.SUCCESS;
    }
}
