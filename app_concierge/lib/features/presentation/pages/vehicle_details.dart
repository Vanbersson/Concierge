import 'dart:convert';
import 'dart:typed_data';

import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/presentation/widgets/mytext.dart';
import 'package:app_concierge/services/vehicle/vehicle_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class VehicleDetails extends StatefulWidget {
  Vehicle vehicleEntry;
  VehicleDetails({
    super.key,
    required this.vehicleEntry,
  });

  @override
  State<VehicleDetails> createState() => _VehicleDetailsState();
}

class _VehicleDetailsState extends State<VehicleDetails> {
  ValueNotifier<String> statusAuthExit = ValueNotifier("Verificando...");

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
    return DefaultTabController(
        length: 4,
        child: Scaffold(
          backgroundColor: Colors.grey.shade100,
          appBar: AppBar(
            title: const Text('Inf. veículo'),
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
          body: TabBarView(children: [
            Padding(
              padding: const EdgeInsets.only(right: 24, left: 24),
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const SizedBox(
                      height: 20,
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
                          myWidth: 160.0,
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        Mytext(
                          showLabel: "Data Entrada",
                          showText: widget.vehicleEntry.dateEntry!,
                          myWidth: 210.0,
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
                          myWidth: 160,
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        Mytext(
                          showLabel: "Frota",
                          showText: widget.vehicleEntry.frota!,
                          myWidth: 210.0,
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 8,
                    ),
                    Mytext(
                      showLabel: "Modelo",
                      showText: widget.vehicleEntry.modelDescription!,
                      myWidth: 370.0,
                    ),
                    const SizedBox(
                      height: 8,
                    ),
                    Mytext(
                      showLabel: "Consultor",
                      showText: widget.vehicleEntry.nameUserAttendant!,
                      myWidth: 370.0,
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
                      myWidth: 370.0,
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
                            ? ElevatedButton(
                                onPressed: () {
                                  //Navigator.of(context).push(_createRouteDriver());
                                },
                                style: ButtonStyle(
                                  elevation:
                                      const WidgetStatePropertyAll<double>(8.0),
                                  backgroundColor:
                                      WidgetStatePropertyAll<Color>(
                                          Colors.green.shade300),
                                  padding: const WidgetStatePropertyAll<
                                          EdgeInsetsGeometry>(
                                      EdgeInsets.symmetric(
                                          horizontal: 170.0, vertical: 16.0)),
                                  shape: WidgetStatePropertyAll<
                                      RoundedRectangleBorder>(
                                    RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                  ),
                                ),
                                child: const Text(
                                  "Saída",
                                  style: TextStyle(color: Colors.black87),
                                ),
                              )
                            : ElevatedButton(
                                onPressed: () {
                                  //Navigator.of(context).push(_createRouteDriver());
                                },
                                style: ButtonStyle(
                                  elevation:
                                      const WidgetStatePropertyAll<double>(8.0),
                                  backgroundColor:
                                      WidgetStatePropertyAll<Color>(
                                          Colors.red.shade300),
                                  padding: const WidgetStatePropertyAll<
                                          EdgeInsetsGeometry>(
                                      EdgeInsets.symmetric(
                                          horizontal: 170.0, vertical: 16.0)),
                                  shape: WidgetStatePropertyAll<
                                      RoundedRectangleBorder>(
                                    RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                  ),
                                ),
                                child: const Text(
                                  "Saída",
                                  style: TextStyle(color: Colors.black87),
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
            Center(
              child: Text("It's rainy here"),
            ),
            Center(
              child: Text("It's sunny here"),
            ),
            Center(
              child: Text("It's sunny here2"),
            ),
          ]),
        ));
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
}
