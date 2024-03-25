
INSERT INTO `tb_address`
(`state`, `city`, `zip_code`, `address`)
VALUES
('PE','Cabo de Santo Agostinho','54590000','Via pedro rossi'),
('PE','Jaboatão dos Guararapes','54330183','Rua Pastos Bons');


INSERT INTO tb_permission
    (id,description)
VALUES
    (100,'ATENDIMENTO ENTRADA VEÍCULO'),
    (101,'AUTORIZAR SAÍDA VEÍCULO'),
    (102,'AUTORIZAR SAÍDA VEÍCULO NIVEL 1'),
    (103,'AUTORIZAR SAÍDA VEÍCULO NIVEL 2'),
    (104,'AUTORIZAR SAÍDA VEÍCULO SEM O.S.'),
    (105,'ALTERAR ATENDIMENTO ENTRADA VEÍCULO');

INSERT INTO `tb_company`
(`status`, `name`, `cnpj`, `email`, `cellphone`, `phone`, `state`, `city`, `zip_code`, `address`, `address_number`)
VALUES
(0,'Vanbersson Luiz Serviços Ltda','08274520000105','vambersson@gmail.com','81982158862','8182158862','PE','Jaboatão dos Guararapes','54330183','Rua Pastos Bons','753 A'),
(0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','PE','Cabo de Santo Agostinho','54590000','Via pedro rossi','382');

INSERT INTO `tb_resale`
(`status`, `name`, `cnpj`, `email`, `cellphone`, `phone`, `state`, `city`, `zip_code`, `address`, `address_number`, `company_id`)
VALUES
(0,'Vanbersson Luiz Serviços Ltda','08274520000105','vambersson@gmail.com','81982158862','8182158862','PE','Jaboatão dos Guararapes','54330183','Rua Pastos Bons','753 A',1),
(0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','PE','Cabo de Santo Agostinho','54590000','Via pedro rossi','382',2);

INSERT INTO `tb_user_role`
(`company_id`, `resale_id`, `status`, `description`)
VALUES
(2,2,0,'TI'),
(2,2,0,'Vendedor Peças'),
(2,2,0,'Vendedor Implementos'),
(2,2,0,'Financeiro'),
(2,2,0,'Diretoria'),
(2,2,0,'Gerente de Oficina'),
(2,2,0,'Almoxarife'),
(2,2,0,'Mecânico'),
(2,2,0,'Recursos Humanos'),
(2,2,0,'Comprador Peças');

INSERT INTO `tb_user`
(`company_id`, `resale_id`, `status`, `name`, `login`, `password`, `email`, `cellphone`, `role_id`)
VALUES
(2,2,0,'vanbersson Luiz Valentin','vambersson@gmail.com','12345','vambersson@gmail.com','81982158862',1);

INSERT INTO tb_vehicle_model
(company_id, resale_id, status, description)
VALUES
(2,2, 0,'Outro'),
(2,2, 0,'Semirreboque Graneleiro'),
(2,2, 0,'Semirreboque Basculante'),
(2,2, 0,'Semirreboque Tanque'),
(2,2, 0,'Semirreboque Furgão Lonado');

INSERT INTO `tb_client_company_type`
(`company_id`, `resale_id`, `status`, `type`, `description`)
VALUES
(2,2,0,0,'Pessoa Jurídica C/Inscrição'),
(2,2,0,1,'Pessoa Jurídica S/Inscrição'),
(2,2,0,1,'Pessoa Física');

INSERT INTO `tb_client_company`
(`company_id`, `resale_id`, `status`, `name`, `cnpj`, `cpf`, `rg`, `email`, `cellphone`, `phone`, `type_id`)
VALUES
(2,2,0,'BBM LOGISTICA S.A','01107327000120','','','','','',1),
(2,2,0,'BAUMINAS LOG E TRANSPORTES SA','14429795000910','','','','','',1),
(2,2,0,'COMPANHIA PERNAMBUCANA DE SANEAMENTO COMPESA','09769035000164','','','','','',1),
(2,2,0,'WHITE MARTINS GASES IND. DO NORDESTE S.A','24380578002203','','','','','',2),
(2,2,0,'JSL S.A','52548435019430','','','','','',1),
(2,2,0,'Daniela Batista','','02892001459','1041359','servicos1@nativarossi.com.br','81996660114','8135211030',3),
(2,2,0,'Dalva Novaes','','06892001457','7041354','financeiro@nativarossi.com.br','81973121312','8135211030',3);
