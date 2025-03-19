
INSERT INTO `tb_address`
(`zip_code`, `state`, `city`, `neighborhood`, `address`)
VALUES
('54590000','PE','Cabo de Santo Agostinho','Distrito DIPER','Via pedro rossi');

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
(`company_id`, `resale_id`,`status`, `name`, `email`, `password`, `cellphone`, `limit_discount`, `role_id`, `role_desc`, `role_func`, `photo`)
VALUES
(1,1,0,'Administrador','vambersson@gmail.com','$2a$10$9EKoKdyZdu.iFS8QnBykoOCW1Gix0PB/k6PN5L5t7URoddZ.wsu9i','81982158862',10,1,'TI',0,'');

INSERT INTO tb_vehicle_model
(company_id, resale_id, status, description,photo)
VALUES
(1,1,0,'Cavalo Mecânico',''),
(1,1,0,'Graneleiro',''),
(1,1,0,'Basculante',''),
(1,1,0,'Tanque',''),
(1,1,0,'Carrega Tudo',''),
(1,1,0,'Dolly',''),
(1,1,0,'Carroceria',''),
(1,1,0,'Porta Contêiner',''),
(1,1,0,'Furgão Lonado',''),
(1,1,0,'Furgão Alumínio',''),
(1,1,0,'Veículo Empresa',''),
(1,1,0,'Veículo Passeio',''),
(1,1,0,'Entrega Material',''),
(1,1,0,'Coleta Material',''),
(1,1,0,'Outro','');

INSERT INTO `tb_client_company_type`
(`company_id`, `resale_id`, `status`,`description`)
VALUES
(1,1,0,'P.J. C/Insc. Est.'),
(1,1,0,'P.J. S/Insc. Est.'),
(1,1,0,'P.F. Consumidor'),
(1,1,0,'O.C. Outro Consumidor');

INSERT INTO tb_type_payment
(`company_id`, `resale_id`, `status`, `description`)
VALUE
(1,1,0,'Dinheiro espécie'),
(1,1,0,'Faturamento especial'),
(1,1,0,'Pix'),
(1,1,0,'Cartão de crédito'),
(1,1,0,'Cartão de débito');




