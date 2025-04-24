package com.concierge.apiconcierge.repositories.reports.parts;

import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PurchaseOrderReportRepository {

    @PersistenceContext
    private EntityManager em;

    public List<PurchaseOrder> filterPurchase(PurchaseOrderReportDto purchaseFilters){
        CriteriaBuilder cb = em.getCriteriaBuilder();

        CriteriaQuery<PurchaseOrder> cq = cb.createQuery(PurchaseOrder.class);
        Root<PurchaseOrder> purchaseOrder = cq.from(PurchaseOrder.class);



        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(purchaseOrder.get("companyId"), purchaseFilters.companyId()));
        predicates.add(cb.equal(purchaseOrder.get("resaleId"), purchaseFilters.resaleId()));

        if(purchaseFilters.clientCompanyId() != null && purchaseFilters.clientCompanyId() != 0)
            predicates.add(cb.equal(purchaseOrder.get("clientCompanyId"), purchaseFilters.clientCompanyId()));

        cq.where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getResultList();

    }


}
