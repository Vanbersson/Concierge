import 'dart:convert';
import 'dart:typed_data';

import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_exit.dart';
import 'package:app_concierge/features/presentation/widgets/mytext.dart';
import 'package:app_concierge/services/vehicle/vehicle_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:share_plus/share_plus.dart';

class VehicleDetails extends StatefulWidget {
  Vehicle vehicleEntry;
  UserLogin userLogin;
  VehicleDetails(
      {super.key, required this.vehicleEntry, required this.userLogin});

  @override
  State<VehicleDetails> createState() => _VehicleDetailsState();
}

class _VehicleDetailsState extends State<VehicleDetails> {
  double sizeScreen = 0;
  final VehicleService _vehicleService = VehicleService();

  ValueNotifier<String> statusAuthExit = ValueNotifier("Verificando...");

  ValueNotifier<bool> loadSave = ValueNotifier(false);

  late Uint8List photo1;
  late Uint8List photo2;
  late Uint8List photo3;
  late Uint8List photo4;
  late Vehicle vehicle;

  @override
  void initState() {
    vehicle = widget.vehicleEntry;
    placaFormat();

    DateTime data = DateTime.parse(vehicle.dateEntry!);
    widget.vehicleEntry.dateEntry = DateFormat("dd/MM/yyyy HH:mm").format(data);

    statusAuthExit.value = vehicle.statusAuthExit!;

    super.initState();
  }

  placaFormat() {
    if (vehicle.vehicleNew == "not") {
      widget.vehicleEntry.placa =
          "${vehicle.placa!.toUpperCase().substring(0, 3)}-${vehicle.placa!.toUpperCase().substring(3, 7)}";
    }
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final myWidght = MediaQuery.of(context).size.width;
    final myHeight = MediaQuery.of(context).size.height;
    sizeScreen = MediaQuery.of(context).size.shortestSide;

    return DefaultTabController(
        length: 4,
        child: Scaffold(
          backgroundColor: Colors.grey.shade100,
          appBar: AppBar(
            title: const Text('Inf. veículo'),
            actions: [
              IconButton(
                  onPressed: () {
                    print(widget.vehicleEntry.dateEntry);
                    shareVehicle(widget.vehicleEntry);
                  },
                  icon: const Icon(Icons.share))
            ],
            bottom: const TabBar(
              tabs: <Widget>[
                Tab(
                  text: "Veículo",
                  icon: Icon(Icons.drive_eta),
                ),
                Tab(
                  text: "Porteiro",
                  icon: Icon(Icons.person_4),
                ),
                Tab(
                  text: "Empresa",
                  icon: Icon(Icons.business),
                ),
                Tab(
                  text: "Motorista",
                  icon: Icon(Icons.person),
                ),
              ],
            ),
          ),
          body: Stack(
            children: [
              TabBarView(children: [
                Padding(
                  padding: EdgeInsets.only(
                      right: sizeScreen * 0.02, left: sizeScreen * 0.02),
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(
                          height: sizeScreen * 0.02,
                        ),
                        ValueListenableBuilder(
                          valueListenable: statusAuthExit,
                          builder: (context, value, child) {
                            return value == "Authorized"
                                ? Column(
                                    children: [
                                      Text(
                                        "Veículo autorizado",
                                        style: TextStyle(
                                            color: Colors.green.shade300,
                                            fontSize: 24.0,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const Text(
                                        "Veículo está autorizado a sair da empresa.",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w300,
                                            fontSize: 16,
                                            color: Colors.black87),
                                      )
                                    ],
                                  )
                                : Column(
                                    children: [
                                      Text(
                                        "Veículo não autorizado",
                                        style: TextStyle(
                                            color: Colors.red.shade300,
                                            fontSize: 24.0,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const Text(
                                        "Veículo não autorizado a sair da empresa.",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w300,
                                            fontSize: 16,
                                            color: Colors.black87),
                                      )
                                    ],
                                  );
                          },
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Row(
                          children: [
                            Mytext(
                              showLabel: "Código",
                              showText: widget.vehicleEntry.id.toString(),
                              myWidth: sizeScreen * 0.3,
                            ),
                            const SizedBox(
                              width: 10,
                            ),
                            Mytext(
                              showLabel: "Data Entrada",
                              showText: widget.vehicleEntry.dateEntry!,
                              myWidth: sizeScreen * 0.63,
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        Row(
                          children: [
                            Mytext(
                              showLabel: "Placa",
                              showText: widget.vehicleEntry.placa!,
                              myWidth: sizeScreen * 0.3,
                            ),
                            const SizedBox(
                              width: 10,
                            ),
                            Mytext(
                              showLabel: "Frota",
                              showText: widget.vehicleEntry.frota!,
                              myWidth: sizeScreen * 0.63,
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        Mytext(
                          showLabel: "Modelo",
                          showText: widget.vehicleEntry.modelDescription!,
                          myWidth: sizeScreen * 0.96,
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        Mytext(
                          showLabel: "Consultor",
                          showText: widget.vehicleEntry.nameUserAttendant!,
                          myWidth: sizeScreen * 0.96,
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        Row(
                          children: [
                            Mytext(
                              showLabel: "N. O.S.",
                              showText: widget.vehicleEntry.numServiceOrder!,
                              myWidth: 120.0,
                            ),
                            const Expanded(child: SizedBox()),
                            Mytext(
                              showLabel: "NFe",
                              showText: widget.vehicleEntry.numNfe!,
                              myWidth: 120.0,
                            ),
                            const Expanded(child: SizedBox()),
                            Mytext(
                              showLabel: "NFS-e",
                              showText: widget.vehicleEntry.numNfe!,
                              myWidth: 120.0,
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        Mytext(
                          showLabel: "Informações",
                          showText: widget.vehicleEntry.information!,
                          myWidth: sizeScreen * 0.96,
                          myHight: 70,
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Row(
                          children: [
                            vehiclePhoto(vehicle.photo1!),
                            const Expanded(child: SizedBox()),
                            vehiclePhoto(vehicle.photo2!),
                            const Expanded(child: SizedBox()),
                            vehiclePhoto(vehicle.photo3!),
                            const Expanded(child: SizedBox()),
                            vehiclePhoto(vehicle.photo4!),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        // Button
                        ValueListenableBuilder(
                          valueListenable: statusAuthExit,
                          builder: (context, value, child) {
                            return value == "Authorized"
                                ? SizedBox(
                                    width: myWidght - sizeScreen * 0.04,
                                    height: 50,
                                    child: ElevatedButton(
                                      onPressed: () {
                                        saveExit(context);
                                      },
                                      style: ButtonStyle(
                                        elevation: const WidgetStatePropertyAll<
                                            double>(8.0),
                                        backgroundColor:
                                            WidgetStatePropertyAll<Color>(
                                                Colors.green.shade300),
                                        shape: WidgetStatePropertyAll<
                                            RoundedRectangleBorder>(
                                          RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                        ),
                                      ),
                                      child: const Text(
                                        "Saída",
                                        style: TextStyle(color: Colors.black87),
                                      ),
                                    ),
                                  )
                                : SizedBox(
                                    width: myWidght - sizeScreen * 0.04,
                                    height: 50,
                                    child: ElevatedButton(
                                      onPressed: () {},
                                      style: ButtonStyle(
                                        elevation: const WidgetStatePropertyAll<
                                            double>(8.0),
                                        backgroundColor:
                                            WidgetStatePropertyAll<Color>(
                                                Colors.red.shade300),
                                        shape: WidgetStatePropertyAll<
                                            RoundedRectangleBorder>(
                                          RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                        ),
                                      ),
                                      child: const Text(
                                        "Saída",
                                        style: TextStyle(color: Colors.black87),
                                      ),
                                    ),
                                  );
                          },
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                      ],
                    ),
                  ),
                ),
                const Center(
                  child: Text("It's rainy here"),
                ),
                const Center(
                  child: Text("It's sunny here"),
                ),
                const Center(
                  child: Text("It's sunny here2"),
                ),
              ]),
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
        ));
  }

  Future<String> exit(VehicleExit vehicle) async {
    String result = await _vehicleService.Exit(vehicle);

    return result;
  }

  Widget vehiclePhoto(String photo) {
    return photo != ""
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

  void saveExit(BuildContext context) {
    final snackBar = SnackBar(
      backgroundColor: Colors.white,
      duration: const Duration(minutes: 1),
      content: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Confirmar saída de veículo?",
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

                VehicleExit ve = VehicleExit();
                ve.companyId = widget.vehicleEntry.companyId;
                ve.resaleId = widget.vehicleEntry.resaleId;
                ve.vehicleId = widget.vehicleEntry.id;
                ve.userId = widget.userLogin.id;
                ve.userName = widget.userLogin.name;

                var df = DateFormat("yyyy-MM-dd");
                var tf = DateFormat("HH:mm:ss");
                ve.dateExit =
                    "${df.format(DateTime.now())}T${tf.format(DateTime.now())}";

                String result = await exit(ve);
                if (result == "Success.") {
                  widget.vehicleEntry.userNameExit = ve.userName;
                  widget.vehicleEntry.dateExit = ve.dateExit;
                  await shareVehicle(widget.vehicleEntry);
                  Navigator.pop(context, true);
                }

                loadSave.value = false;
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
              child: const Text(
                "Não",
                style: TextStyle(color: Colors.black87),
              ),
            ),
          ),
        ],
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  String getFormatDataHora(String data) {
    if (data == "") {
      return "";
    } else {
      DateTime dt = DateTime.parse(data);
      var formate = DateFormat('dd/MM/yyyy HH:mm').format(dt);
      return formate.toString();
    }
  }

  String maskPlaca(String placa) {
    try {
      var mask = MaskTextInputFormatter(
        mask: "###-####",
        filter: {"#": RegExp(r'[0-9 A-Z a-z]')},
      );
      return mask.maskText(placa).toUpperCase();
    } catch (e) {
      return "";
    }
  }

  shareVehicle(Vehicle vehicle) async {
    final result = await Share.share("Código: ${vehicle.id}\n"
        "Empresa código: ${vehicle.clientCompanyId}\n"
        "Empresa nome: ${vehicle.clientCompanyName}\n"
        "Modelo: ${vehicle.modelDescription}\nCor: ${vehicle.color} \n"
        "Placa: ${maskPlaca(vehicle.placa!)}\nFrota: ${vehicle.frota}\nKM: ${vehicle.kmEntry}\n"
        "Data entrada: ${vehicle.dateEntry}\nPorteiro entrada: ${vehicle.nameUserEntry}\n"
        "Data saída: ${vehicle.dateExit == null ? '' : getFormatDataHora(vehicle.dateExit.toString())}\nPorteiro saída: ${vehicle.userNameExit ?? ''}\n"
        "Consultor: ${vehicle.nameUserAttendant ?? ''}\n"
        "O.S.: ${vehicle.numServiceOrder != 0 ? vehicle.numServiceOrder : ''}\n"
        "NFe: ${vehicle.numNfe != 0 ? vehicle.numNfe : ''}\n"
        "NFS-e: ${vehicle.numNfse != 0 ? vehicle.numNfse : ''}\n"
        "Obs Porteiro: ${vehicle.informationConcierge}\n"
        "Obs Consultor: ${vehicle.information}\n");

    return result;
  }
}
