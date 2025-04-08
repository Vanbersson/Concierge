package com.concierge.apiconcierge.services.budget.item;

import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.BudgetItem;
import com.concierge.apiconcierge.repositories.budget.IBudgetItemRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.budget.item.IBudgetItemValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetItemService implements IBudgetItemService {
    @Autowired
    IBudgetItemRepository repository;

    @Autowired
    IBudgetItemValidation validation;

    @SneakyThrows
    @Override
    public String save(BudgetItem part) {
        try {
            String message = this.validation.save(part);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                part.setId(null);
                this.repository.save(part);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String update(BudgetItem part) {
        try {
            String message = this.validation.update(part);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(part);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String delete(BudgetItem part) {
        try {
            String message = this.validation.delete(part);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.delete(part);
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String deleteAllDiscount(BudgetItem part) {
        try {
            String message = this.validation.update(part);
            if (ConstantsMessage.SUCCESS.equals(message)) {

                List<BudgetItem> list = this.repository.listAllItems(part.getCompanyId(), part.getResaleId(), part.getBudgetId());
                for (var item : list) {
                    item.setDiscount(0);
                    this.repository.save(item);
                }
                return ConstantsMessage.SUCCESS;
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public List<BudgetItem> listItems(Integer companyId, Integer resaleId, Integer budgetId) {
        try {
            String message = this.validation.listItems(companyId, resaleId, budgetId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.listAllItems(companyId, resaleId, budgetId);
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }
}
