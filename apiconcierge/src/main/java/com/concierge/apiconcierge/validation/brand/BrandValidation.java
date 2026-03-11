package com.concierge.apiconcierge.validation.brand;

import com.concierge.apiconcierge.models.brand.Brand;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class BrandValidation implements IBrandValidation {
    @Override
    public MessageResponse save(Brand b) {
        MessageResponse response = new MessageResponse();
        if (b.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (b.getName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Nome");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Marca");
        response.setMessage("Cadastrada com sucesso.");
        return response;
    }

    @Override
    public MessageResponse update(Brand b) {
        MessageResponse response = new MessageResponse();

        if (b.getId() == null || b.getId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Código");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (b.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (b.getName().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Nome");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Marca");
        response.setMessage("Atualizada com sucesso.");
        return response;
    }

}
