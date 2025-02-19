import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:app_concierge/features/domain/user/user_attendant.dart';
import 'package:app_concierge/features/domain/user/user_driver.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_provider.dart';
import 'package:flutter/material.dart';

import 'package:app_concierge/features/presentation/pages/vehicle_page.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

class VehicleAddPage extends StatefulWidget {
  UserLogin userLogin;
  ClientCompany clientCompany;
  UserDriver userDriver;
  List<VehicleModel> model;
  List<UserAttendant> attendants;
  VehicleAddPage(
      {super.key,
      required this.userLogin,
      required this.clientCompany,
      required this.userDriver,
      required this.model,
      required this.attendants});

  @override
  State<VehicleAddPage> createState() => _VehicleAddPageState();
}

class _VehicleAddPageState extends State<VehicleAddPage> {
  @override
  void initState() {
    context.read<VehicleProvider>().removeAll();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final myWidght = MediaQuery.of(context).size.width;
    final myHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Padding(
        padding: const EdgeInsets.only(right: 24.0, left: 24.0),
        child: SingleChildScrollView(
          child: SizedBox(
            width: myWidght,
            height: myHeight,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: myWidght,
                  height: 120,
                  child: ListView.builder(
                    itemCount: context.watch<VehicleProvider>().items.length,
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (context, index) {
                      String model = context
                          .watch<VehicleProvider>()
                          .items[index]
                          .modelDescription!;
                      String placa = context
                          .watch<VehicleProvider>()
                          .items[index]
                          .placa
                          .toString();
                      String corlor = context
                          .watch<VehicleProvider>()
                          .items[index]
                          .color
                          .toString();

                      return Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: widgetVehicle(model, placa, corlor),
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
                                      model: widget.model,
                                      attendants: widget.attendants)));
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
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget widgetVehicle(String model, String placa, String color) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Material(
        child: Ink(
          height: 120,
          width: 200,
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(10.0)),
          child: InkWell(
            onTap: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => VehiclePage(
                          model: widget.model, attendants: widget.attendants)));
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
                            child: Image.network(
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGiXV0Rky8hVFD1Kt75dNFGGgfh-qN8QdXWfSqBKdkt5-p9BFDJai6g3s2ao9yScpdQGQ&usqp=CAU",
                              fit: BoxFit.cover,
                              width: 70,
                            ),
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
                            placa,
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
}
