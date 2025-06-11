import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:app_concierge/features/domain/client/client_company_provider.dart';
import 'package:app_concierge/features/domain/user/user_driver.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_provider.dart';
import 'package:app_concierge/services/cliente/client_company_service.dart';
import 'package:app_concierge/services/vehicle/vehicle_service.dart';
import 'package:intl/intl.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter/material.dart';
import 'dart:convert';

import 'package:app_concierge/features/presentation/pages/vehicle_page.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

class VehicleAddPage extends StatefulWidget {
  UserLogin userLogin;
  //ClientCompany clientCompany;
  UserDriver userDriver;

  VehicleAddPage(
      {super.key,
      required this.userLogin,
      //required this.clientCompany,
      required this.userDriver});

  @override
  State<VehicleAddPage> createState() => _VehicleAddPageState();
}

class _VehicleAddPageState extends State<VehicleAddPage> {
  double sizeScreen = 0;
  final VehicleService _vehicleService = VehicleService();
  final ClientCompanyService _clientService = ClientCompanyService();
  List<Vehicle> _vehicles = [];

  ValueNotifier<bool> loadSave = ValueNotifier(false);

  Future<String> saveClient(ClientCompany client) async {
    String resultSave = await _clientService.save(client);
    return resultSave;
  }

  Future<String> saveVehicle(Vehicle vehicle) async {
    String resultSave = await _vehicleService.save(vehicle);
    return resultSave;
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final myWidght = MediaQuery.of(context).size.width;
    final myHeight = MediaQuery.of(context).size.height;
    sizeScreen = MediaQuery.of(context).size.shortestSide;

    _vehicles = context.watch<VehicleProvider>().items;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 24.0, left: 24.0),
            child: SingleChildScrollView(
              child: SizedBox(
                width: myWidght,
                height: myHeight,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: myWidght,
                      height: 120,
                      child: ListView.builder(
                        itemCount: _vehicles.length,
                        scrollDirection: Axis.horizontal,
                        itemBuilder: (context, index) {
                          String model = _vehicles[index].modelDescription!;
                          String placa = _vehicles[index].placa ?? "";
                          String color = _vehicles[index].color ?? "";
                          String photo = _vehicles[index].photo1 ?? "";

                          return Padding(
                            padding: const EdgeInsets.only(right: 10),
                            child: widgetVehicle(
                                photo, model, placa, color, index),
                          );
                        },
                      ),
                    ),
                    const SizedBox(
                      height: 25.0,
                    ),
                    const Text(
                      "Vamos adicionar os veículos",
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                          color: Colors.black87),
                    ),
                    const Text(
                      "Click no botão para adicionar.",
                      style: TextStyle(
                          fontWeight: FontWeight.w300,
                          fontSize: 16,
                          color: Colors.black87),
                    ),
                    const SizedBox(
                      height: 50.0,
                    ),
                    //Add
                    ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: Material(
                        color: Colors.grey.shade100,
                        child: Ink(
                          width: 120,
                          height: 120,
                          child: InkWell(
                            onTap: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => VehiclePage(
                                          userLogin: widget.userLogin,
                                          userDriver: widget.userDriver)));
                            },
                            child: Lottie.asset(
                              'assets/lotties/animation-add.json',
                              width: 120,
                              height: 120,
                              fit: BoxFit.fill,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const Expanded(child: SizedBox()),
                    _vehicles.isNotEmpty
                        ? SizedBox(
                            width: myWidght - sizeScreen * 0.04,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: () async {
                                save(context);
                              },
                              style: ButtonStyle(
                                elevation:
                                    const WidgetStatePropertyAll<double>(8.0),
                                backgroundColor: WidgetStatePropertyAll<Color>(
                                    Colors.blue.shade300),
                                shape: WidgetStatePropertyAll<
                                    RoundedRectangleBorder>(
                                  RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                ),
                              ),
                              child: const Text(
                                "Finalizar",
                                style: TextStyle(color: Colors.black87),
                              ),
                            ),
                          )
                        : Container(),
                    const SizedBox(height: 20.0),
                  ],
                ),
              ),
            ),
          ),
          ValueListenableBuilder(
            valueListenable: loadSave,
            builder: (context, value, child) {
              return value
                  ? Container(
                      width: myWidght,
                      height: myHeight,
                      decoration: const BoxDecoration(
                          color: Color.fromARGB(103, 190, 190, 190)),
                      child: const Center(
                        child: CircularProgressIndicator(
                          color: Colors.blue,
                          strokeWidth: 2,
                        ),
                      ),
                    )
                  : const SizedBox();
            },
          ),
        ],
      ),
    );
  }

  Widget widgetVehicle(
      String photo, String model, String placa, String color, int indexItem) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Material(
        child: Ink(
          height: 120,
          width: 200,
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(10.0)),
          child: InkWell(
            onLongPress: () {
              context.read<VehicleProvider>().removeItem(indexItem);
            },
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    children: [
                      Center(
                        child: SizedBox(
                          width: 60,
                          height: 60,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: vehiclePhoto(photo),
                          ),
                        ),
                      ),
                      const Expanded(child: SizedBox()),
                      Column(
                        children: [
                          Text(
                            model,
                            style: const TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.w400),
                          ),
                          Text(
                            maskPlaca(placa),
                            style: const TextStyle(
                              fontWeight: FontWeight.w400,
                              color: Colors.black87,
                            ),
                          ),
                          Text(
                            color,
                            style: const TextStyle(
                              fontWeight: FontWeight.w400,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
                const Expanded(child: SizedBox()),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 28,
                        decoration: BoxDecoration(
                            color: Colors.blue.shade300,
                            borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(10.0),
                                bottomRight: Radius.circular(10.0))),
                        child: const Center(
                          child: Text(
                            "Editar",
                            style: TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.w400),
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget vehiclePhoto(String photo) {
    return photo.isNotEmpty
        ? Container(
            decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(10.0)),
            child: Image.memory(
              base64Decode(photo),
              width: 80,
              height: 80,
              fit: BoxFit.cover,
            ),
          )
        : Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(10.0)),
            child: Icon(
              Icons.photo,
              color: Colors.grey.shade500,
              size: 50.0,
            ),
          );
  }

  void save(BuildContext context) {
    final snackBar = SnackBar(
      backgroundColor: Colors.white,
      duration: const Duration(minutes: 1),
      content: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Salvar os veículos?",
              style: TextStyle(fontSize: 16, color: Colors.black87),
            ),
          ),
          const SizedBox(
            height: 10,
          ),
          SizedBox(
            width: sizeScreen - sizeScreen * 0.04,
            height: 50,
            child: FilledButton(
              onPressed: () async {
                ScaffoldMessenger.of(context).clearSnackBars();

                loadSave.value = true;

                //Save Client

                if (context.watch<ClientCompanyProvider>().client.id != null) {
                  await saveClient(context.watch<ClientCompanyProvider>().client);
                }

                //Save Vehicles
                final List<Vehicle> _listTempErro = [];

                for (var i = 0; i < _vehicles.length; i++) {
                  String resultSave = await saveVehicle(_vehicles[i]);

                  if (resultSave == "Error.") {
                    _listTempErro.add(_vehicles[i]);
                  } else {
                    await shareVehicle(_vehicles[i]);
                  }
                }
                loadSave.value = false;
                context.read<VehicleProvider>().removeAll();

                if (_listTempErro.isNotEmpty) {
                  for (var element in _listTempErro) {
                    context.read<VehicleProvider>().add(element);
                  }
                }

                if (_vehicles.isEmpty) {
                  Navigator.pop(context, false);
                }
              },
              style: ButtonStyle(
                backgroundColor:
                    const WidgetStatePropertyAll<Color>(Colors.blue),
                shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
              child: const Text("Sim"),
            ),
          ),
          const SizedBox(
            height: 8,
          ),
          SizedBox(
            width: sizeScreen - sizeScreen * 0.04,
            height: 50,
            child: OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).clearSnackBars();
                },
                style: ButtonStyle(
                  shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                ),
                child: const Text("Não")),
          )
        ],
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  String maskPlaca(String placa) {
    try {
      var mask = MaskTextInputFormatter(
        mask: "###-####",
        filter: {"#": RegExp(r'[0-9 a-z]')},
      );
      return mask.maskText(placa).toUpperCase();
    } catch (e) {
      return "";
    }
  }
  String formatDate(String date) {
    if (date == "") return "";
    DateTime dateTime = DateTime.parse(date).toLocal();
    return DateFormat("dd/MM/yyyy HH:mm").format(dateTime);
  }
  shareVehicle(Vehicle vehicle) async {
    final result = await Share.share("Código: ${vehicle.id}\n"
        "Empresa código: ${vehicle.clientCompanyId != 0 ? vehicle.clientCompanyId : ""}\n"
        "Empresa nome: ${vehicle.clientCompanyName == "" ? "Empresa não cadastrada" : vehicle.clientCompanyName}\n"
        "Modelo: ${vehicle.modelDescription}\nCor: ${vehicle.color} \n"
        "Placa: ${maskPlaca(vehicle.placa!)}\nFrota: ${vehicle.frota}\nKM: ${vehicle.kmEntry}\n"
        "Entrada: ${formatDate(vehicle.dateEntry!)}\nSaída: ${formatDate(vehicle.dateExit!)}\n"
        "Porteiro Entrada: ${vehicle.nameUserEntry}\nPorteiro Saída: ${vehicle.userNameExit}\n"
        "Consultor: ${vehicle.nameUserAttendant ?? ''}\n"
        "O.S.: ${vehicle.numServiceOrder != 0 ? vehicle.numServiceOrder : ''}\n"
        "NFe: ${vehicle.numNfe != 0 ? vehicle.numNfe : ''}\n"
        "NFS-e: ${vehicle.numNfse != 0 ? vehicle.numNfse : ''}\n"
        "Obs Porteiro: ${vehicle.informationConcierge}\n"
        "Obs Consultor: ${vehicle.information}\n");

    return result;
  }
}
