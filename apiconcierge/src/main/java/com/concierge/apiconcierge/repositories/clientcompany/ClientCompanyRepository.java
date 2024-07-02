package com.concierge.apiconcierge.repositories.clientcompany;

import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.models.clientcompany.ClientCompanyTypeEnum;
import com.concierge.apiconcierge.models.status.StatusEnableDisable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ClientCompanyRepository {

    @PersistenceContext
    private EntityManager entityManager;



    public List<ClientCompany> getListId(Integer companyId, Integer resaleId, Integer id) {

        String query = "select " +
                "c.companyId, " +
                "c.resaleId, " +
                "c.id, " +
                "c.status, " +
                "c.name, " +
                "c.cnpj, " +
                "c.cpf, " +
                "c.rg, " +
                "c.email, " +
                "c.cellphone, " +
                "c.phone, " +
                "c.typeId, c.type from ClientCompany c where c.companyId = :companyId and c.resaleId = :resaleId and c.id = :id ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("id", id);

        List<Object[]> result = typedQuery.getResultList();


        List<ClientCompany> list = new ArrayList<>();
        ClientCompany clientCompany;

        for (Object[] row : result) {

            clientCompany = new ClientCompany();

            clientCompany.setCompanyId((Integer) row[0]);
            clientCompany.setResaleId((Integer) row[1]);
            clientCompany.setId((Integer) row[2]);
            clientCompany.setStatus((StatusEnableDisable) row[3]);
            clientCompany.setName((String) row[4]);
            clientCompany.setCnpj((String) row[5]);
            clientCompany.setCpf((String) row[6]);
            clientCompany.setRg((String) row[7]);
            clientCompany.setEmail((String) row[8]);
            clientCompany.setCellphone((String) row[9]);
            clientCompany.setPhone((String) row[10]);
            clientCompany.setTypeId((Integer) row[11]);
            clientCompany.setType((ClientCompanyTypeEnum) row[12]);

            list.add(clientCompany);

        }

        return list;
    }

    public List<ClientCompany> getListName(Integer companyId, Integer resaleId, String name) {

        String query = "select " +
                "c.companyId, " +
                "c.resaleId, " +
                "c.id, " +
                "c.status, " +
                "c.name, " +
                "c.cnpj, " +
                "c.cpf, " +
                "c.rg, " +
                "c.email, " +
                "c.cellphone, " +
                "c.phone, " +
                "c.typeId, c.type from ClientCompany c where c.companyId = :companyId and c.resaleId = :resaleId and c.name like CONCAT('%',:name,'%') ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("name", name);

        List<Object[]> result = typedQuery.getResultList();


        List<ClientCompany> list = new ArrayList<>();
        ClientCompany clientCompany;

        for (Object[] row : result) {

            clientCompany = new ClientCompany();

            clientCompany.setCompanyId((Integer) row[0]);
            clientCompany.setResaleId((Integer) row[1]);
            clientCompany.setId((Integer) row[2]);
            clientCompany.setStatus((StatusEnableDisable) row[3]);
            clientCompany.setName((String) row[4]);
            clientCompany.setCnpj((String) row[5]);
            clientCompany.setCpf((String) row[6]);
            clientCompany.setRg((String) row[7]);
            clientCompany.setEmail((String) row[8]);
            clientCompany.setCellphone((String) row[9]);
            clientCompany.setPhone((String) row[10]);
            clientCompany.setTypeId((Integer) row[11]);
            clientCompany.setType((ClientCompanyTypeEnum) row[12]);

            list.add(clientCompany);

        }

        return list;
    }

    public List<ClientCompany> getListCnpj(Integer companyId, Integer resaleId, String cnpj) {

        String query = "select " +
                "c.companyId, " +
                "c.resaleId, " +
                "c.id, " +
                "c.status, " +
                "c.name, " +
                "c.cnpj, " +
                "c.cpf, " +
                "c.rg, " +
                "c.email, " +
                "c.cellphone, " +
                "c.phone, " +
                "c.typeId, c.type from ClientCompany c where c.companyId = :companyId and c.resaleId = :resaleId and c.cnpj = :cnpj ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("cnpj", cnpj);

        List<Object[]> result = typedQuery.getResultList();


        List<ClientCompany> list = new ArrayList<>();
        ClientCompany clientCompany;

        for (Object[] row : result) {

            clientCompany = new ClientCompany();

            clientCompany.setCompanyId((Integer) row[0]);
            clientCompany.setResaleId((Integer) row[1]);
            clientCompany.setId((Integer) row[2]);
            clientCompany.setStatus((StatusEnableDisable) row[3]);
            clientCompany.setName((String) row[4]);
            clientCompany.setCnpj((String) row[5]);
            clientCompany.setCpf((String) row[6]);
            clientCompany.setRg((String) row[7]);
            clientCompany.setEmail((String) row[8]);
            clientCompany.setCellphone((String) row[9]);
            clientCompany.setPhone((String) row[10]);
            clientCompany.setTypeId((Integer) row[11]);
            clientCompany.setType((ClientCompanyTypeEnum) row[12]);

            list.add(clientCompany);

        }

        return list;
    }

    public List<ClientCompany> getListCpf(Integer companyId, Integer resaleId, String cpf) {

        String query = "select " +
                "c.companyId, " +
                "c.resaleId, " +
                "c.id, " +
                "c.status, " +
                "c.name, " +
                "c.cnpj, " +
                "c.cpf, " +
                "c.rg, " +
                "c.email, " +
                "c.cellphone, " +
                "c.phone, " +
                "c.typeId, c.type from ClientCompany c where c.companyId = :companyId and c.resaleId = :resaleId and c.cpf = :cpf ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("cpf", cpf);

        List<Object[]> result = typedQuery.getResultList();


        List<ClientCompany> list = new ArrayList<>();
        ClientCompany clientCompany;

        for (Object[] row : result) {

            clientCompany = new ClientCompany();

            clientCompany.setCompanyId((Integer) row[0]);
            clientCompany.setResaleId((Integer) row[1]);
            clientCompany.setId((Integer) row[2]);
            clientCompany.setStatus((StatusEnableDisable) row[3]);
            clientCompany.setName((String) row[4]);
            clientCompany.setCnpj((String) row[5]);
            clientCompany.setCpf((String) row[6]);
            clientCompany.setRg((String) row[7]);
            clientCompany.setEmail((String) row[8]);
            clientCompany.setCellphone((String) row[9]);
            clientCompany.setPhone((String) row[10]);
            clientCompany.setTypeId((Integer) row[11]);
            clientCompany.setType((ClientCompanyTypeEnum) row[12]);

            list.add(clientCompany);

        }

        return list;
    }

    public List<ClientCompany> getListRg(Integer companyId, Integer resaleId, String rg) {

        String query = "select " +
                "c.companyId, " +
                "c.resaleId, " +
                "c.id, " +
                "c.status, " +
                "c.name, " +
                "c.cnpj, " +
                "c.cpf, " +
                "c.rg, " +
                "c.email, " +
                "c.cellphone, " +
                "c.phone, " +
                "c.typeId, c.type from ClientCompany c where c.companyId = :companyId and c.resaleId = :resaleId and c.rg = :rg ";

        TypedQuery<Object[]> typedQuery = entityManager.createQuery(query, Object[].class);

        typedQuery.setParameter("companyId", companyId);
        typedQuery.setParameter("resaleId", resaleId);
        typedQuery.setParameter("rg", rg);

        List<Object[]> result = typedQuery.getResultList();


        List<ClientCompany> list = new ArrayList<>();
        ClientCompany clientCompany;

        for (Object[] row : result) {

            clientCompany = new ClientCompany();

            clientCompany.setCompanyId((Integer) row[0]);
            clientCompany.setResaleId((Integer) row[1]);
            clientCompany.setId((Integer) row[2]);
            clientCompany.setStatus((StatusEnableDisable) row[3]);
            clientCompany.setName((String) row[4]);
            clientCompany.setCnpj((String) row[5]);
            clientCompany.setCpf((String) row[6]);
            clientCompany.setRg((String) row[7]);
            clientCompany.setEmail((String) row[8]);
            clientCompany.setCellphone((String) row[9]);
            clientCompany.setPhone((String) row[10]);
            clientCompany.setTypeId((Integer) row[11]);
            clientCompany.setType((ClientCompanyTypeEnum) row[12]);

            list.add(clientCompany);

        }

        return list;
    }

}
