import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:app_concierge/features/presentation/pages/driver_page.dart';
import 'package:app_concierge/features/presentation/widgets/mytext.dart';
import 'package:app_concierge/services/cliente/client_company_service.dart';
import 'package:app_concierge/services/vehicle/vehicle_service.dart';
import 'package:flutter/material.dart';

class ClienteCompanyPage extends StatefulWidget {
  UserLogin userLogin;

  ClienteCompanyPage({super.key, required this.userLogin});

  @override
  State<ClienteCompanyPage> createState() => _ClienteCompanyPageState();
}

class _ClienteCompanyPageState extends State<ClienteCompanyPage> {
  ValueNotifier<Future<List<ClientCompany>>> clients =
      ValueNotifier<Future<List<ClientCompany>>>(Future.value([]));
  ValueNotifier<ClientCompany> selectClient =
      ValueNotifier<ClientCompany>(ClientCompany());

  final TextEditingController clientNameFilter = TextEditingController();
  ValueNotifier<bool> isChecked = ValueNotifier(false);

  @override
  void initState() {
        super.initState();
  }

  String abreviaFantasia(String name) {
    if (name.length < 20) {
      return name;
    } else {
      return name.substring(0, 20);
    }
  }

  String abreviaName(String name) {
    if (name.length < 32) {
      return name;
    } else {
      return name.substring(0, 32);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Padding(
        padding: const EdgeInsets.only(right: 24, left: 24),
        child: Column(
          children: [
            const Expanded(
              flex: 1,
              child: SizedBox(),
            ),
            const Text(
              "Vamos fazer a entrada de um novo veículo",
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  color: Colors.black87),
            ),
            const Text(
              "Por favor selecione a empresa em que esse veículo pertence.",
              style: TextStyle(
                  fontWeight: FontWeight.w300,
                  fontSize: 16,
                  color: Colors.black87),
            ),
            const SizedBox(height: 20.0),
            //Check
            ValueListenableBuilder(
                valueListenable: isChecked,
                builder: (BuildContext context, bool value, Widget? child) {
                  return Row(
                    children: [
                      Checkbox(
                        value: value,
                        checkColor: Colors.black54,
                        activeColor: Colors.green.shade300,
                        onChanged: (bool? sele) {
                          isChecked.value = sele!;
                          selectClient.value = ClientCompany();
                        },
                      ),
                      GestureDetector(
                          onTap: () {
                            isChecked.value = !isChecked.value;
                            selectClient.value = ClientCompany();
                          },
                          child: const Text("Empresa sem cadastro!")),
                    ],
                  );
                }),

            const SizedBox(
              height: 20,
            ),
            ElevatedButton(
              onPressed: () {
                _showDialog(context);
              },
              style: ButtonStyle(
                elevation: const WidgetStatePropertyAll<double>(8.0),
                backgroundColor:
                    WidgetStatePropertyAll<Color>(Colors.deepOrange.shade300),
                padding: const WidgetStatePropertyAll<EdgeInsetsGeometry>(
                    EdgeInsets.symmetric(horizontal: 125.0, vertical: 16.0)),
                shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
              child: const Text(
                "Selecione a empresa",
                style: TextStyle(color: Colors.black87),
              ),
            ),
            const SizedBox(
              height: 25.0,
            ),
            //Código / Fansasia
            Row(
              children: [
                ValueListenableBuilder(
                  valueListenable: selectClient,
                  builder: (context, value, child) {
                    return Mytext(
                      showLabel: "Código",
                      showText: value.id == null ? "" : "${value.id}",
                      myWidth: 100.0,
                    );
                  },
                ),
                const SizedBox(width: 10),
                ValueListenableBuilder(
                  valueListenable: selectClient,
                  builder: (context, value, child) {
                    return Mytext(
                      showLabel: "Fantasia",
                      showText: value.fantasia == null
                          ? ""
                          : abreviaFantasia(value.fantasia.toString()),
                      myWidth: 270.0,
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            //NOME
            ValueListenableBuilder(
              valueListenable: selectClient,
              builder: (context, value, child) {
                return Mytext(
                  showLabel: "Nome",
                  showText: value.name == null
                      ? ""
                      : abreviaName(value.name.toString()),
                  myWidth: 380.0,
                );
              },
            ),

            const SizedBox(height: 8),
            //CNPF/CPF
            ValueListenableBuilder(
              valueListenable: selectClient,
              builder: (context, value, child) {
                return Mytext(
                  showLabel: "CNPJ/CPF",
                  showText: value.fisjur == "Juridica"
                      ? value.cnpj ?? ""
                      : value.cpf ?? "",
                  myWidth: 380.0,
                );
              },
            ),

            const Expanded(flex: 1, child: SizedBox()),
            ElevatedButton(
              onPressed: () {
                if (selectClient.value.id != null || isChecked.value == true) {
                  Navigator.of(context).push(_createRouteDriver());
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Empresa não selecionada.'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              style: ButtonStyle(
                elevation: const WidgetStatePropertyAll<double>(8.0),
                backgroundColor:
                    WidgetStatePropertyAll<Color>(Colors.blue.shade300),
                padding: const WidgetStatePropertyAll<EdgeInsetsGeometry>(
                    EdgeInsets.symmetric(horizontal: 160.0, vertical: 16.0)),
                shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
              child: const Text(
                "Continuar",
                style: TextStyle(color: Colors.black87),
              ),
            ),
            const SizedBox(height: 20.0),
          ],
        ),
      ),
    );
  }

  Route _createRouteDriver() {
    return PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => DriverPage(
              userLogin: widget.userLogin,
              clientCompany: selectClient.value,
            ),
        transitionDuration: const Duration(milliseconds: 600),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.ease;

          final tween = Tween(begin: begin, end: end);

          final curvedAnimation =
              CurvedAnimation(parent: animation, curve: curve);

          return SlideTransition(
            position: tween.animate(curvedAnimation),
            child: child,
          );
        });
  }

  void _showDialog(BuildContext context) {
    ValueNotifier<bool> isCheckedJ = ValueNotifier(true);
    ValueNotifier<bool> isCheckedF = ValueNotifier(false);
    showDialog(
      context: context,
      builder: (context) {
        return SingleChildScrollView(
          child: Dialog(
            child: Container(
              width: 400,
              height: 800,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const Text(
                      'Pesquisa de empresas',
                      style: TextStyle(
                        color: Colors.black87,
                        fontSize: 16,
                      ),
                    ),
                    const Divider(
                      color: Colors.grey,
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    //Textfield search
                    TextFormField(
                      controller: clientNameFilter,
                      textInputAction: TextInputAction.done,
                      validator: (text) {
                        if (text == null || text.trim().isEmpty) {
                          return "Inválido!";
                        }
                        return null;
                      },
                      style: const TextStyle(
                        color: Colors.black87,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      decoration: InputDecoration(
                        fillColor: Colors.grey.shade200,
                        filled: true,
                        labelText: "Nome",
                        labelStyle: const TextStyle(
                          fontWeight: FontWeight.w300,
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                        enabledBorder: const OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                          borderRadius: BorderRadius.all(
                            Radius.circular(10.0),
                          ),
                        ),
                        focusedBorder: const OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                          borderRadius: BorderRadius.all(
                            Radius.circular(10.0),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    //Check
                    Row(
                      children: [
                        ValueListenableBuilder(
                            valueListenable: isCheckedJ,
                            builder: (BuildContext context, bool value,
                                Widget? child) {
                              return Row(
                                children: [
                                  Checkbox(
                                    value: value,
                                    checkColor: Colors.black54,
                                    activeColor: Colors.green.shade300,
                                    onChanged: (bool? sele) {
                                      isCheckedJ.value = true;
                                      isCheckedF.value = false;
                                    },
                                  ),
                                  GestureDetector(
                                      onTap: () {
                                        isCheckedJ.value = true;
                                        isCheckedF.value = false;
                                      },
                                      child: const Text("Jurídica")),
                                ],
                              );
                            }),
                        const SizedBox(
                          width: 10,
                        ),
                        ValueListenableBuilder(
                            valueListenable: isCheckedF,
                            builder: (BuildContext context, bool value,
                                Widget? child) {
                              return Row(
                                children: [
                                  Checkbox(
                                    value: value,
                                    checkColor: Colors.black54,
                                    activeColor: Colors.green.shade300,
                                    onChanged: (bool? sele) {
                                      isCheckedJ.value = false;
                                      isCheckedF.value = true;
                                    },
                                  ),
                                  GestureDetector(
                                      onTap: () {
                                        isCheckedJ.value = false;
                                        isCheckedF.value = true;
                                      },
                                      child: const Text("Física")),
                                ],
                              );
                            }),
                      ],
                    ),
                    //Filter
                    ElevatedButton(
                        onPressed: () {
                          if (isCheckedJ.value == true) {
                            filterJClient();
                          } else {
                            filterFClient();
                          }
                        },
                        style: ButtonStyle(
                          elevation: const WidgetStatePropertyAll<double>(8.0),
                          backgroundColor: WidgetStatePropertyAll<Color>(
                              Colors.deepOrange.shade300),
                          padding:
                              const WidgetStatePropertyAll<EdgeInsetsGeometry>(
                                  EdgeInsets.symmetric(
                                      horizontal: 116.0, vertical: 16.0)),
                          shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                          ),
                        ),
                        child: const Text(
                          "Pesquisar",
                          style: TextStyle(color: Colors.black),
                        )),
                    ValueListenableBuilder(
                      valueListenable: clients,
                      builder: (context, value, child) {
                        return Expanded(
                          flex: 1,
                          child: FutureBuilder<List<ClientCompany>>(
                            future: value,
                            builder: (context, snapshot) {
                              final status = snapshot.connectionState;

                              //Erro
                              if (snapshot.hasError) {
                                return const Center(
                                  child: Text(
                                    'Erro ao listar empresas!',
                                    style: TextStyle(
                                        color: Colors.deepOrange,
                                        fontWeight: FontWeight.w300),
                                  ),
                                );
                              }
                              //Carregando...
                              if (status == ConnectionState.waiting) {
                                return const Center(
                                  child: SizedBox(
                                    height: 50,
                                    width: 50,
                                    child: CircularProgressIndicator(
                                      color: Colors.deepOrange,
                                      strokeWidth: 2,
                                    ),
                                  ),
                                );
                              }
                              //Carregou
                              if (status == ConnectionState.done) {
                                if (snapshot.data!.isNotEmpty) {
                                  return ListView.builder(
                                    itemCount: snapshot.data!.length,
                                    scrollDirection: Axis.vertical,
                                    itemBuilder: (_, index) {
                                      ClientCompany cli = snapshot.data![index];

                                      return ListTile(
                                        leading: CircleAvatar(
                                            child: Text(
                                          cli.name!.substring(0, 1),
                                        )),
                                        title: Text(cli.name!.substring(0, 16)),
                                        subtitle: cli.fisjur == "Juridica"
                                            ? Text(cli.cnpj!)
                                            : Text(cli.cpf!),
                                        trailing: ValueListenableBuilder(
                                          valueListenable: selectClient,
                                          builder: (context, value, child) {
                                            return Radio<ClientCompany>(
                                              value: cli,
                                              groupValue: value,
                                              onChanged: (data) {
                                                selectClient.value = data!;
                                              },
                                            );
                                          },
                                        ),
                                      );
                                    },
                                  );
                                }
                              }
                              //
                              return const Center(
                                child: Text(
                                  'Empresa não encontrada',
                                  style: TextStyle(
                                      color: Colors.black54,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16.0),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),

                    //Button
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: const Text(
                              "Fechar",
                              style: TextStyle(color: Colors.black87),
                            )),
                        const SizedBox(
                          width: 10,
                        ),
                        FilledButton(
                            onPressed: () {
                              Navigator.pop(context);
                              isChecked.value = false;
                            },
                            style: ButtonStyle(
                                backgroundColor: WidgetStatePropertyAll<Color>(
                                    Colors.blue.shade300)),
                            child: const Text(
                              "Confirmar",
                              style: TextStyle(color: Colors.black87),
                            )),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  void filterJClient() {
    ClientCompanyService service = ClientCompanyService();
    clients.value = service.filterJName(clientNameFilter.text.trim());
  }

  void filterFClient() {
    ClientCompanyService service = ClientCompanyService();
    clients.value = service.filterFName(clientNameFilter.text.trim());
  }
}
