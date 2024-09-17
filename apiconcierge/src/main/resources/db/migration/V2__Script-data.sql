
INSERT INTO `tb_address`
(`zip_code`, `state`, `city`, `neighborhood`, `address`)
VALUES
('54590000','PE','Cabo de Santo Agostinho','Distrito DIPER','Via pedro rossi'),
('54330183','PE','Jaboatão dos Guararapes','Cajueiro Seco','Rua Pastos Bons');

INSERT INTO tb_permission
    (id,description)
VALUES
    (100,'autorizar entrada de veículos'),
    (101,'autorizar saída de veículos'),
    (102,'autorizar saída de veículo - 1ª'),
    (103,'autorizar saída de veículo - 2ª'),
    (104,'autorizar saída de veículo sem O.S.'),
    (105,'manutenção entrada de veículo');

INSERT INTO `tb_company`
(`status`, `name`, `cnpj`, `email`, `cellphone`, `phone`, `zip_code`, `state`, `city`, `neighborhood`, `address`, `address_number`)
VALUES
(0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','54590000', 'PE','Cabo de Santo Agostinho','Distrito DIPER','Via pedro rossi','382');

INSERT INTO `tb_resale`
(`company_id`,`status`, `name`, `cnpj`, `email`, `cellphone`, `phone`,  `zip_code`, `state`, `city`, `neighborhood`, `address`, `address_number`)
VALUES
(1,0,'Nativa Máquinas e Implementos Ltda','08274520000102','ti@nativarossi.com.br','','8135211030','54590000', 'PE','Cabo de Santo Agostinho','Distrito DIPER','Via pedro rossi','382');

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
(`company_id`, `resale_id`, `status`, `name`,`email`, `password`, `cellphone`, `role_id`,`role_desc`,`role_func`)
VALUES
(1,1,0,'Administrador','vambersson@gmail.com','$2a$10$9EKoKdyZdu.iFS8QnBykoOCW1Gix0PB/k6PN5L5t7URoddZ.wsu9i','81982158862',1,'TI',0),
(1,1,0,'Daniela Batista','servicos1@nativarossi.com.br','$2a$12$9ikssJkNBTMRacAricc9/uCJkj1LE7bL8jdYN6QtLb7AkpRthLUai','81996660114',2,'Vendedor',1),
(1,1,0,'Allyson Rogerio','servicos2@nativarossi.com.br','$2a$12$9ikssJkNBTMRacAricc9/uCJkj1LE7bL8jdYN6QtLb7AkpRthLUai','81996670018',2,'Vendedor',1),
(1,1,0,'Alef Fernando','servicos3@nativarossi.com.br','$2a$12$9ikssJkNBTMRacAricc9/uCJkj1LE7bL8jdYN6QtLb7AkpRthLUai','8196670017',2,'Vendedor',1);

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
(`company_id`, `resale_id`, `status`,`description`)
VALUES
(1,1,0,'P.J. C/Insc. Est.'),
(1,1,0,'P.J. S/Insc. Est.'),
(1,1,0,'P.F. Consumidor'),
(1,1,0,'O.C. Outro Consumidor');

INSERT INTO `tb_client_company`
(`company_id`, `resale_id`, `status`, `name`, `fantasia`, `clifor`, `fisjur`,`cnpj`, `cpf`, `rg`,
 `email_home`, `email_work`, `ddd_cellphone`, `cellphone`, `ddd_phone`, `phone`, `zip_code`, `state`, `city`,
 `neighborhood`, `address`, `address_number`, `address_complement`)
VALUES (1,1,0,'bbm logistica s.a','bbm logistica s.a',0,1,'01107327000804','','','','','81','981541754','','',
'54503900','pe','cabo de santos agostinho', 'distrito industrial diper','km 96,4 bloco central de frete','0',''),
(1,1,0,'santin equipamentos transp. importação exportação ltda','santin',0,1,'05134355000197','','','','','','','16','33939999',
'14820000','sp','americo brasiliense', 'iii distrito industrial','av. herminio cristovão','110','');




