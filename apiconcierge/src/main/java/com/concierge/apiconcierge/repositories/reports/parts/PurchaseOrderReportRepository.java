package com.concierge.apiconcierge.repositories.reports.parts;

import com.concierge.apiconcierge.dtos.reports.parts.PurchaseOrderReportDto;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
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

    public List<PurchaseOrder> filterPurchase(PurchaseOrderReportDto purchaseFilters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        CriteriaQuery<PurchaseOrder> cq = cb.createQuery(PurchaseOrder.class);
        Root<PurchaseOrder> purchaseOrder = cq.from(PurchaseOrder.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(purchaseOrder.get("companyId"), purchaseFilters.companyId()));
        predicates.add(cb.equal(purchaseOrder.get("resaleId"), purchaseFilters.resaleId()));

        if (purchaseFilters.dateInit() != null && purchaseFilters.dateFinal() != null) {
            Predicate preGeneration = cb.between(purchaseOrder.get("dateGeneration"), purchaseFilters.dateInit(), purchaseFilters.dateFinal());
            Predicate preDelivery = cb.between(purchaseOrder.get("dateDelivery"), purchaseFilters.dateInit(), purchaseFilters.dateFinal());
            Predicate preReceived = cb.between(purchaseOrder.get("dateReceived"), purchaseFilters.dateInit(), purchaseFilters.dateFinal());
            predicates.add(cb.or(preGeneration, cb.or(preDelivery, cb.or(preReceived))));
        }

        if (!purchaseFilters.status().isBlank()) {
            if (purchaseFilters.status().equals(PurchaseOrderStatus.Open_Purchase_Order.toString()))
                predicates.add(cb.equal(purchaseOrder.get("status"), PurchaseOrderStatus.Open_Purchase_Order));
            if (purchaseFilters.status().equals(PurchaseOrderStatus.Closed_Purchase_Order.toString()))
                predicates.add(cb.equal(purchaseOrder.get("status"), PurchaseOrderStatus.Closed_Purchase_Order));
        }

        if (purchaseFilters.id() != null && purchaseFilters.id() != 0)
            predicates.add(cb.equal(purchaseOrder.get("id"), purchaseFilters.id()));
        if (purchaseFilters.clientCompanyId() != null && purchaseFilters.clientCompanyId() != 0)
            predicates.add(cb.equal(purchaseOrder.get("clientCompanyId"), purchaseFilters.clientCompanyId()));
        if (purchaseFilters.responsibleId() != null && purchaseFilters.responsibleId() != 0)
            predicates.add(cb.equal(purchaseOrder.get("responsibleId"), purchaseFilters.responsibleId()));
        if (purchaseFilters.nfNum() != null && purchaseFilters.nfNum() != 0)
            predicates.add(cb.equal(purchaseOrder.get("nfNum"), purchaseFilters.nfNum()));


        cq.where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getResultList();

    }


}
