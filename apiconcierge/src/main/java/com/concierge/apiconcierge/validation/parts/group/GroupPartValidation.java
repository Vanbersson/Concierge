package com.concierge.apiconcierge.validation.parts.group;

import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.part.group.GroupPart;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.stereotype.Service;

@Service
public class GroupPartValidation implements IGroupPartValidation {
    @Override
    public MessageResponse save(GroupPart g) {
        MessageResponse response = new MessageResponse();
        if (g.getCompanyId() == null || g.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getResaleId() == null || g.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getType() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Tipo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Descrição");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getBrandId() == null || g.getBrandId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Marca");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Grupo");
        response.setMessage("Cadastrado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse update(GroupPart g) {
        MessageResponse response = new MessageResponse();
        if (g.getCompanyId() == null || g.getCompanyId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Empresa");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getResaleId() == null || g.getResaleId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getId() == null || g.getId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Revenda");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getStatus() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Status");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getType() == null) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Tipo");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getDescription().isBlank()) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Descrição");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        if (g.getBrandId() == null || g.getBrandId() == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Marca");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Grupo");
        response.setMessage("Atualizado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse listAll(Integer companyId, Integer resaleId) {
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
        response.setHeader("Grupo");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }

    @Override
    public MessageResponse filterBrand(Integer companyId, Integer resaleId, Integer brandId) {
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
        if (brandId == null || brandId == 0) {
            response.setStatus(ConstantsMessage.ERROR);
            response.setHeader("Marca");
            response.setMessage(ConstantsMessage.NOT_INFORMED);
            return response;
        }
        response.setStatus(ConstantsMessage.SUCCESS);
        response.setHeader("Grupo");
        response.setMessage("Encontrado com sucesso.");
        return response;
    }
}
