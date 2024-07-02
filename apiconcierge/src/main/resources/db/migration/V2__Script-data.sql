
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
(0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','PE','Cabo de Santo Agostinho','54590000','Via pedro rossi','382');

INSERT INTO `tb_resale`
(`status`, `name`, `cnpj`, `email`, `cellphone`, `phone`, `state`, `city`, `zip_code`, `address`, `address_number`, `company_id`)
VALUES
(0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','PE','Cabo de Santo Agostinho','54590000','Via pedro rossi','382',1);

INSERT INTO `tb_user_role`
(`company_id`, `resale_id`, `status`, `description`)
VALUES
(1,1,0,'TI'),
(1,1,0,'Vendedor'),
(1,1,0,'Comprador'),
(1,1,0,'Assistente'),
(1,1,0,'Financeiro'),
(1,1,0,'Diretoria'),
(1,1,0,'Gerente'),
(1,1,0,'Almoxarife'),
(1,1,0,'Mecânico'),
(1,1,0,'Porteiro'),
(1,1,0,'Motorista'),
(1,1,0,'Recursos Humanos');

INSERT INTO `tb_user`
(`company_id`, `resale_id`, `status`, `name`,`email`, `password`, `cellphone`, `role_id`)
VALUES
(1,1,0,'Vanbersson Luiz','vambersson@gmail.com','12345','81982158862',1),
(1,1,0,'Daniela Batista','servicos1@nativarossi.com.br','12345','81982158862',2),
(1,1,0,'Alef','servicos3@nativarossi.com.br','12345','81982158862',2),
(1,1,0,'Allyson','servicos2@nativarossi.com.br','12345','81982158862',2),
(1,1,0,'Marcelo','portaria.marcelo@nativarossi.com.br','12345','81982158862',10),
(1,1,0,'Antonio','portaria.antonio@nativarossi.com.br','12345','81982158862',10),
(1,1,0,'Carlos Fernando','carlos.fernando@nativarossi.com.br','12345','81982158862',7),
(1,1,0,'Dalva Novaes','financeiro@nativarossi.com.br','12345','81982158862',5),
(1,1,0,'Janeide Maria','rh@nativarossi.com.br','12345','81982158862',12);

INSERT INTO tb_vehicle_model
(company_id, resale_id, status, description)
VALUES
(1,1,0,'Outro'),
(1,1,0,'Graneleiro'),
(1,1,0,'Basculante'),
(1,1,0,'Tanque'),
(1,1,0,'Carrega Tudo'),
(1,1,0,'Cavalo Mecânico'),
(1,1,0,'Dolly'),
(1,1,0,'Carroceria'),
(1,1,0,'Porta Contêiner'),
(1,1,0,'Furgão Lonado'),
(1,1,0,'Furgão Alumínio'),
(1,1,0,'Veículo Empresa'),
(1,1,0,'Veículo Passeio'),
(1,1,0,'Entrega Material'),
(1,1,0,'Coleta Material');

INSERT INTO `tb_client_company_type`
(`company_id`, `resale_id`, `status`, `type`, `description`)
VALUES
(1,1,0,0,'P.J. C/Insc. Est.'),
(1,1,0,0,'P.J. S/Insc. Est.'),
(1,1,0,1,'P.F. Consumidor'),
(1,1,0,1,'O.C. Outro Consumidor');

INSERT INTO `tb_client_company`
(`company_id`, `resale_id`, `status`, `name`, `cnpj`, `cpf`, `rg`, `email`, `cellphone`, `phone`, `type_id`,`type`)
VALUES
(1,1,0,'NÃO CADASTRADO','12345678912345','','','','','',4,0),
(1,1,0,'BBM LOGISTICA S.A','01107327000120','','','','','',1,0),
(1,1,0,'BAUMINAS LOG E TRANSPORTES SA','14429795000910','','','','','',1,0),
(1,1,0,'COMPANHIA PERNAMBUCANA DE SANEAMENTO COMPESA','09769035000164','','','','','',1,0),
(1,1,0,'WHITE MARTINS GASES IND. DO NORDESTE S.A','24380578002203','','','','','',2,0),
(1,1,0,'JSL S.A','52548435019430','','','','','',1,0),
(1,1,0,'Daniela Batista','','02892001459','1041359','servicos1@nativarossi.com.br','81996660114','8135211030',3,1),
(1,1,0,'Dalva Novaes','','06892001457','7041354','financeiro@nativarossi.com.br','81973121312','8135211030',3,1);





