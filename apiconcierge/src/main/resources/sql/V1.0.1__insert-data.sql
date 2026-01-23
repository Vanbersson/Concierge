
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
(`company_id`, `resale_id`,`status`, `name`, `email`, `password`, `cellphone`, `limit_discount`, `role_id`, `role_desc`, `role_func`, `photo_url`)
VALUES
(1,1,0,'Administrador','vambersson@gmail.com','$2a$10$9EKoKdyZdu.iFS8QnBykoOCW1Gix0PB/k6PN5L5t7URoddZ.wsu9i','81982158862',10,1,'TI',0,'');

INSERT INTO tb_vehicle_model
(company_id, resale_id, status, description,photo_url)
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

INSERT INTO `tb_client_company_category`
(`company_id`, `resale_id`, `status`,`description`)
VALUES
(1,1,0,'P.F. Consumidor'),
(1,1,0,'P.J. C/Insc. Est.'),
(1,1,0,'P.J. S/Insc. Est.');


INSERT INTO tb_payment_type
(`company_id`, `resale_id`, `status`, `description`)
VALUE
(1,1,0,'À vista (dinheiro)'),
(1,1,0,'À vista (pix)'),
(1,1,0,'À vista (transferência)'),
(1,1,0,'Cartão de débito'),
(1,1,0,'Cartão de crédito'),
(1,1,0,'Cartão de crédito parcelado 2x'),
(1,1,0,'Cartão de crédito parcelado 3x'),
(1,1,0,'Cartão de crédito parcelado 4x'),
(1,1,0,'Cartão de crédito parcelado 5x'),
(1,1,0,'Cartão de crédito parcelado 6x'),
(1,1,0,'Cartão de crédito parcelado 7x'),
(1,1,0,'Cartão de crédito parcelado 8x'),
(1,1,0,'Cartão de crédito parcelado 9x'),
(1,1,0,'Cartão de crédito parcelado 10x'),
(1,1,0,'Cartão de crédito parcelado 11x'),
(1,1,0,'Cartão de crédito parcelado 12x'),
(1,1,0,'Faturamento especial'),
(1,1,0,'Faturamento 30 dias'),
(1,1,0,'Faturamento 30/60 dias'),
(1,1,0,'Faturamento 30/60/90 dias'),
(1,1,0,'Faturamento 30/60/90/120 dias'),
(1,1,0,'Faturamento 30/60/90/120/150 dias'),
(1,1,0,'Faturamento 30/60/90/120/150/180 dias');

INSERT INTO `tb_menu`
(`id`, `description`)
VALUES
('0_0','Dashboard'),
('1_0','Portaria'),
('1_1','Entrada de Veículo'),
('1_2','Veículos'),
('1_5','Saída de Veiculo'),
('1_3','Motorista'),
('1_99','Cadastros'),
('1_99_0','Modelo'),
('1_99_1','Veículo'),

('2_0','Peças'),
('2_1','Atendimento Peças'),
('2_2','Pedidos de compras'),
('2_99','Cadastros'),
('2_99_0','Peças'),

('3_0','Oficina'),
('3_1','Atendimento Oficina'),

('3_2','Controle de equipamentos'),
('3_2_0','Requisições'),
('3_2_1','Cadastros'),
('3_2_1_0','Categoria'),
('3_2_1_1','Material'),
('3_3','Orçamentos'),
('3_99','Cadastros'),
('3_99_0','Mecânico'),

('4_0','Faturamento'),
('4_1','Manutenção Clientes'),

('100_0','Relatório'),
('100_1','Portaria'),
('100_1_0','Veículos'),
('100_2','Peças'),
('100_2_0','Pedidos de compras'),

('999_0','Configurações'),
('999_1','Empresa'),
('999_2','Cadastro Usuários');


INSERT INTO tb_permission
(id,description,menu)
VALUES
(100,'Editar entrada de veículo','Portaria'),
(101,'Autorizar saída de veículo','Portaria'),
(102,'Autorizar saída de veículo - 1ª','Portaria'),
(103,'Autorizar saída de veículo - 2ª','Portaria'),
(104,'Remover autorização de saída de veículo - 1ª','Portaria'),
(105,'Remover autorização de saída de veículo - 2ª','Portaria'),
(106,'Autorizar saída de veículo sem O.S.','Portaria'),
(107,'Remover autorização de saída de veículo sem O.S.','Portaria'),
(150,'Gerar orçamento','Portaria'),
(151,'Manutenção orçamento','Portaria'),
(152,'Visualizar orçamento','Portaria'),
(153,'Receber notificações de entrada veículo','Portaria'),
(154,'Receber notificações de saída veículo','Portaria'),
(300,'Alterar quantidade material','Oficina');





