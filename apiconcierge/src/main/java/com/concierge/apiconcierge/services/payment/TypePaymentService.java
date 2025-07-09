package com.concierge.apiconcierge.services.payment;

import com.concierge.apiconcierge.models.payment.TypePayment;
import com.concierge.apiconcierge.repositories.payment.ITypePaymentRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypePaymentService implements ITypePaymentService {

    @Autowired
    ITypePaymentRepository repository;

    @SneakyThrows
    @Override
    public List<TypePayment> listAll(Integer companyId, Integer resaleId) {
        try {
            return this.repository.listAll(companyId, resaleId);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }

    }

    @SneakyThrows
    @Override
    public List<TypePayment> listAllEnabled(Integer companyId, Integer resaleId) {
        try {
            return this.repository.listAllEnabled(companyId, resaleId);
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }
    }
}
