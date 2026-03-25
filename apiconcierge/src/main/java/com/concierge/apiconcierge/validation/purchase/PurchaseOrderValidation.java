package com.concierge.apiconcierge.validation.purchase;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.purchase.PurchaseOrder;
import com.concierge.apiconcierge.models.purchase.statusEnum.PurchaseOrderStatus;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.validation.purchase.IPurchaseOrderValidation;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderValidation implements IPurchaseOrderValidation {
    @Override
    public MessageResponse save(PurchaseOrder pu) {
        MessageResponse response = new MessageResponse();
        if (pu.getCompanyId() == null || pu.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getResaleId() == null || pu.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getType() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Tipo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }

        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Pedido de Compra");
        response.setMessage("Cadastrado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse update(PurchaseOrder pu) {
        MessageResponse response = new MessageResponse();
        if (pu.getCompanyId() == null || pu.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getResaleId() == null || pu.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getId() == null || pu.getId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (pu.getType() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Tipo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }

        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Pedido de Compra");
        response.setMessage("Atualizado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse filterOpen(Integer companyId, Integer resaleId) {
        MessageResponse response = new MessageResponse();
        if (companyId == null || companyId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (resaleId == null || resaleId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Pedido de Compra");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }

    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer purchaseId) {
        MessageResponse response = new MessageResponse();
        if (companyId == null || companyId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (resaleId == null || resaleId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (purchaseId == null || purchaseId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Pedido de Compra");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Pedido de Compra");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }
}
