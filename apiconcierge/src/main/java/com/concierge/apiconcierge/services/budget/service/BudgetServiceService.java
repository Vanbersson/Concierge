package com.concierge.apiconcierge.services.budget.service;

import com.concierge.apiconcierge.exceptions.budget.BudgetException;
import com.concierge.apiconcierge.models.budget.BudgetService;
import com.concierge.apiconcierge.repositories.budget.IBudgetServiceRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.budget.service.IBudgetServiceValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetServiceService implements IBudgetServiceService {

    @Autowired
    IBudgetServiceRepository repository;

    @Autowired
    IBudgetServiceValidation validation;

    @SneakyThrows
    @Override
    public String save(BudgetService budgetService) {
        try {
            String message = this.validation.save(budgetService);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                budgetService.setId(null);
                this.repository.save(budgetService);
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
    public String update(BudgetService budgetService) {
        try {
            String message = this.validation.update(budgetService);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.save(budgetService);
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
    public List<BudgetService> listServices(Integer companyId, Integer resaleId, Integer budgetId) {
        try {
            String message = this.validation.listServices(companyId, resaleId, budgetId);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                return this.repository.listAllService(companyId, resaleId, budgetId);
            } else {
                throw new BudgetException(message);
            }
        } catch (Exception ex) {
            throw new BudgetException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public String delete(BudgetService budgetService) {
        try {
            String message = this.validation.delete(budgetService);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                this.repository.deleteService(budgetService.getCompanyId(), budgetService.getResaleId(), budgetService.getId());

                //Atualiza ordem
                List<BudgetService> list = this.repository.listAllService(budgetService.getCompanyId(), budgetService.getResaleId(), budgetService.getBudgetId());
                for (int i = 0; i < list.size(); i++) {
                    list.get(i).setOrdem(i + 1);
                    this.repository.save(list.get(i));
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
    public String deleteAllDiscount(BudgetService budgetService) {
        try {
            String message = this.validation.deleteAllDiscount(budgetService);
            if (ConstantsMessage.SUCCESS.equals(message)) {
                List<BudgetService> list = this.repository.listAllService(budgetService.getCompanyId(), budgetService.getResaleId(), budgetService.getBudgetId());
                for (BudgetService item : list) {
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
}
