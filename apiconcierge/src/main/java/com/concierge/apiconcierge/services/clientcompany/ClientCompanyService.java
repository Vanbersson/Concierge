package com.concierge.apiconcierge.services.clientcompany;

import com.concierge.apiconcierge.exceptions.clientcompany.ClientCompanyException;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.FisJurEnum;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.repositories.clientcompany.IClientCompanyRepository;
import com.concierge.apiconcierge.util.ConstantsMessage;
import com.concierge.apiconcierge.util.ConstantsUrls;
import com.concierge.apiconcierge.validation.clientcompany.ClientCompanyValidation;
import com.concierge.apiconcierge.validation.clientcompany.IClientCompanyValidation;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClientCompanyService implements IClientCompanyService {
    @Autowired
    private IClientCompanyRepository repository;

    @Autowired
    private IClientCompanyValidation validation;

    @SneakyThrows
    @Override
    public MessageResponse save(ClientCompany client) {
        try {
            MessageResponse response = this.validation.save(client);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                if (client.getFisjur() == FisJurEnum.Física) {
                    client.setCnpj("");
                } else {
                    client.setCpf("");
                    client.setRg("");
                }
                ClientCompany clientResult = this.repository.save(client);
                response.setData(clientResult);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse update(ClientCompany client) {
        try {
            MessageResponse response = this.validation.update(client);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                this.repository.save(client);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse listAll(Integer companyId, Integer resaleId) {
        try {
            MessageResponse response = this.validation.listAll(companyId, resaleId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<ClientCompany> list = this.repository.listAll(companyId, resaleId);
                if (list.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer clientId) {
        try {
            MessageResponse response = this.validation.filterId(companyId, resaleId, clientId);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                ClientCompany client = this.repository.filterId(companyId, resaleId, clientId);
                if (client == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(client);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterJFantasia(Integer companyId, Integer resaleId, String fantasia) {
        try {
            MessageResponse response = this.validation.filterFantasia(companyId, resaleId, fantasia);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<ClientCompany> list = this.repository.filterFantasia(companyId, resaleId, FisJurEnum.Jurídica, fantasia);
                if (list.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterFFantasia(Integer companyId, Integer resaleId, String fantasia) {
        try {
            MessageResponse response = this.validation.filterFantasia(companyId, resaleId, fantasia);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<ClientCompany> list = this.repository.filterFantasia(companyId, resaleId, FisJurEnum.Física, fantasia);
                if (list.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterJNome(Integer companyId, Integer resaleId, String name) {
        try {
            MessageResponse response = this.validation.filterName(companyId, resaleId, name);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<ClientCompany> list = this.repository.filterName(companyId, resaleId, FisJurEnum.Jurídica, name);
                if (list.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterFNome(Integer companyId, Integer resaleId, String name) {
        try {
            MessageResponse response = this.validation.filterName(companyId, resaleId, name);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                List<ClientCompany> list = this.repository.filterName(companyId, resaleId, FisJurEnum.Física, name);
                if (list.isEmpty()) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(list);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterCNPJ(Integer companyId, Integer resaleId, String cnpj) {
        try {
            MessageResponse response = this.validation.filterCNPJ(companyId, resaleId, cnpj);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                ClientCompany client = this.repository.filterCNPJ(companyId, resaleId, cnpj);
                if (client == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(client);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public MessageResponse filterCPF(Integer companyId, Integer resaleId, String cpf) {
        try {
            MessageResponse response = this.validation.filterCPF(companyId, resaleId, cpf);
            if (ConstantsMessage.SUCCESS.equals(response.getStatus())) {
                ClientCompany client = this.repository.filterCPF(companyId, resaleId, cpf);
                if (client == null) {
                    response.setStatus(ConstantsMessage.ERROR);
                    response.setHeader("Informações");
                    response.setMessage("Não encontrado.");
                    return response;
                }
                response.setData(client);
                return response;
            } else {
                return response;
            }
        } catch (Exception ex) {
            throw new ClientCompanyException(ex.getMessage());
        }
    }
}
