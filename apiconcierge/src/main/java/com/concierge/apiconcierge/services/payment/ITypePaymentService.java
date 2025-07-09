package com.concierge.apiconcierge.services.payment;

import com.concierge.apiconcierge.models.payment.TypePayment;

import java.util.List;

public interface ITypePaymentService {

    List<TypePayment> listAll(Integer companyId, Integer resaleId);

    List<TypePayment> listAllEnabled(Integer companyId, Integer resaleId);
}
