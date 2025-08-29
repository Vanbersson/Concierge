import 'dart:async';
import 'dart:ffi';

import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_entry.dart';
import 'package:app_concierge/features/presentation/pages/client_company_page.dart';
import 'package:app_concierge/features/presentation/pages/splash_page.dart';
import 'package:app_concierge/features/presentation/pages/vehicle_details.dart';
import 'package:app_concierge/features/presentation/widgets/vehicle_item_list.dart';
import 'package:app_concierge/services/vehicle/vehicle_service.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:intl/intl.dart';

import 'package:app_concierge/features/domain/user/user_login.dart';

class MainPage extends StatefulWidget {
  UserLogin userLogin;
  MainPage({super.key, required this.userLogin});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  double sizeScreen = 0;
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  final searchController = TextEditingController();
  final VehicleService _vehicleService = VehicleService();
  late Timer timer;

  late List<VehicleEntry> listVehicleEntryFilter = [];

  final ValueNotifier<List<VehicleEntry>> listVehicles =
      ValueNotifier<List<VehicleEntry>>([]);

  final ValueNotifier<int> _currIndexIconSearch = ValueNotifier<int>(0);
  final ValueNotifier<int> _allAuthorizedTotal = ValueNotifier<int>(0);
  ValueNotifier<bool> clickViewVehicle = ValueNotifier(false);

  double myHeight = 0;
  double myWidth = 0;

  int companyId = 0;
  int resaleId = 0;

  @override
  void initState() {
    companyId = widget.userLogin.companyId!;
    resaleId = widget.userLogin.resaleId!;

    initSearch();
    verifyVehicleAllAuthorized();

    super.initState();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  void initSearch() async {
    clickViewVehicle.value = true;
    // Obter as listas de veículos autorizados
    List<VehicleEntry> vehiclesAuth = await _vehicleService.allAuthorized(
      companyId,
      resaleId,
    );
    listVehicles.value = await _vehicleService.allPendingAuthorization(
      companyId,
      resaleId,
    );

    //Total de veículos autorizados
    _allAuthorizedTotal.value = vehiclesAuth.length;
    clickViewVehicle.value = false;
  }

  void verifyVehicleAllAuthorized() async {
    timer = Timer.periodic(const Duration(seconds: 30), (timer) async {
      try {
        // Obter a lista de veículos autorizados
        List<VehicleEntry> vehicleAuth1 = await _vehicleService.allAuthorized(
          companyId,
          resaleId,
        );

        //Total de veículos autorizados
        _allAuthorizedTotal.value = vehicleAuth1.length;

        // Obter a lista de veículos
        listVehicles.value = await _vehicleService.allPendingAuthorization(
          companyId,
          resaleId,
        );
      } catch (e) {
        // print("Erro ao consultar e atualizar a lista: $e");
      }
    });
  }

  void filterSearchResults(String searchString) async {
    timer.cancel();

    listVehicleEntryFilter = listVehicles.value;
    List<VehicleEntry> temp1 = [];

    if (searchString.isNotEmpty && _currIndexIconSearch.value == 0) {
      _currIndexIconSearch.value = 1;

      temp1 = listVehicleEntryFilter
          .where((vehicle) => vehicle.placa.toString().contains(searchString))
          .toList();
      if (searchString == "novo") {
        temp1 += listVehicleEntryFilter
            .where((vehicle) => vehicle.vehicleNew.toString().contains("yes"))
            .toList();
      }
      temp1 += listVehicleEntryFilter
          .where(
            (vehicle) => vehicle.clientCompanyName.toString().contains(
              searchString.toUpperCase(),
            ),
          )
          .toList();

      temp1 += listVehicleEntryFilter
          .where(
            (vehicle) =>
                vehicle.modelDescription.toString().contains(searchString),
          )
          .toList();

      temp1 += listVehicleEntryFilter
          .where(
            (vehicle) =>
                formatDate(vehicle.dateEntry.toString()).contains(searchString),
          )
          .toList();

      listVehicles.value = temp1;
    } else {
      _currIndexIconSearch.value = 0;
      searchController.text = "";
      listVehicleEntryFilter = [];

      initSearch();
      verifyVehicleAllAuthorized();
    }
  }

  @override
  Widget build(BuildContext context) {
    Uint8List userPhoto = base64Decode(widget.userLogin.photo!);
    myWidth = MediaQuery.of(context).size.width;
    myHeight = MediaQuery.of(context).size.height;

    sizeScreen = MediaQuery.of(context).size.shortestSide;

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        leading: widget.userLogin.photo != ""
            ? Padding(
                padding: const EdgeInsets.only(left: 24.0),
                child: CircleAvatar(
                  radius: 40,
                  backgroundImage: MemoryImage(userPhoto),
                ),
              )
            : Padding(
                padding: const EdgeInsets.only(left: 24.0),
                child: CircleAvatar(
                  radius: 40,
                  child: Text(
                    widget.userLogin.name.toString().substring(0, 1),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18.0,
                      color: Colors.black54,
                    ),
                  ),
                ),
              ),
        title: Text("Olá, ${widget.userLogin.name.toString().split(' ')[0]}"),
        backgroundColor: Colors.grey.shade100,
        scrolledUnderElevation: 4.0,
        shadowColor: Theme.of(context).colorScheme.shadow,
        actions: <Widget>[
          ValueListenableBuilder(
            valueListenable: _allAuthorizedTotal,
            builder: (context, value, child) {
              return value > 0
                  ? Stack(
                      children: [
                        IconButton(
                          onPressed: () {},
                          color: Colors.black45,
                          icon: Icon(
                            Icons.notifications_active_outlined,
                            color: Colors.black54,
                          ),
                        ),
                        Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            height: 16,
                            width: 16,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: Colors.green,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              "$value",
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10.0,
                              ),
                            ),
                          ),
                        ),
                      ],
                    )
                  : const Icon(Icons.notifications_none, color: Colors.black54);
            },
          ),
          //Exit
          Padding(
            padding: const EdgeInsets.only(right: 24.0),
            child: IconButton(
              onPressed: () {
                final snackBar = SnackBar(
                  backgroundColor: Colors.white,
                  duration: const Duration(minutes: 1),
                  content: Column(
                    children: [
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "Deseja realmente sair do aplicativo?",
                          style: TextStyle(fontSize: 16, color: Colors.black87),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: myWidth - sizeScreen * 0.04,
                        height: 50,
                        child: FilledButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).clearSnackBars();
                            deletestorage();
                            Navigator.pop(context, false);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const SplashPage(),
                              ),
                            );
                          },
                          style: ButtonStyle(
                            backgroundColor:
                                const WidgetStatePropertyAll<Color>(
                                  Colors.blue,
                                ),
                            shape:
                                WidgetStatePropertyAll<RoundedRectangleBorder>(
                                  RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                ),
                          ),
                          child: const Text("Sim"),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: myWidth - sizeScreen * 0.04,
                        height: 50,
                        child: OutlinedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).clearSnackBars();
                          },
                          style: ButtonStyle(
                            shape:
                                WidgetStatePropertyAll<RoundedRectangleBorder>(
                                  RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                ),
                          ),
                          child: Text("Não"),
                        ),
                      ),
                    ],
                  ),
                );

                ScaffoldMessenger.of(context).showSnackBar(snackBar);
              },
              color: Colors.black54,
              icon: const Icon(Icons.logout),
            ),
          ),
        ],
      ),
      backgroundColor: Colors.grey.shade100,
      body: Stack(
        children: [
          Column(
            children: [
              const SizedBox(height: 25),
              //Search
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: TextFormField(
                  controller: searchController,
                  onTapOutside: (event) => FocusScope.of(context).unfocus(),
                  style: const TextStyle(
                    color: Colors.black87,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  decoration: InputDecoration(
                    suffixIcon: Container(
                      width: 60,
                      height: 55,
                      decoration: BoxDecoration(
                        color: Colors.deepOrange.shade300,
                        borderRadius: const BorderRadius.only(
                          topRight: Radius.circular(8),
                          bottomRight: Radius.circular(8),
                        ),
                      ),
                      child: IconButton(
                        icon: ValueListenableBuilder(
                          valueListenable: _currIndexIconSearch,
                          builder: (context, value, child) {
                            return AnimatedSwitcher(
                              duration: const Duration(milliseconds: 450),
                              transitionBuilder: (child, anim) =>
                                  RotationTransition(
                                    turns:
                                        child.key ==
                                            const ValueKey('iconSearch1')
                                        ? Tween<double>(
                                            begin: 1,
                                            end: 0.75,
                                          ).animate(anim)
                                        : Tween<double>(
                                            begin: 0.75,
                                            end: 1,
                                          ).animate(anim),
                                    child: ScaleTransition(
                                      scale: anim,
                                      child: child,
                                    ),
                                  ),
                              child: _currIndexIconSearch.value != 0
                                  ? const Icon(
                                      Icons.close,
                                      key: ValueKey('iconSearch1'),
                                    )
                                  : const Icon(
                                      Icons.search,
                                      key: ValueKey('iconSearch2'),
                                    ),
                            );
                          },
                        ),
                        onPressed: () {
                          filterSearchResults(searchController.text);

                          //Fecha o teclado
                          FocusScope.of(context).unfocus();
                        },
                      ),
                    ),
                    fillColor: Colors.grey.shade200,
                    filled: true,
                    labelText: "Pesquisar",
                    labelStyle: const TextStyle(
                      fontWeight: FontWeight.w300,
                      fontSize: 16,
                      color: Colors.black87,
                    ),
                    enabledBorder: const OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.grey),
                      borderRadius: BorderRadius.all(Radius.circular(10.0)),
                    ),
                    focusedBorder: const OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.grey),
                      borderRadius: BorderRadius.all(Radius.circular(10.0)),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              //List vehicles
              Expanded(
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: sizeScreen * 0.02),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: const BorderRadius.all(Radius.circular(20.0)),
                  ),
                  child: ValueListenableBuilder(
                    valueListenable: listVehicles,
                    builder: (context, value, child) {
                      return vehicles(value);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 20),
              //Entry
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  FloatingActionButton.extended(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ClienteCompanyPage(userLogin: widget.userLogin),
                        ),
                      );
                    },
                    label: const Text('Entrada'),
                    icon: const Icon(Icons.add),
                    backgroundColor: Colors.blue.shade300,
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
          ValueListenableBuilder(
            valueListenable: clickViewVehicle,
            builder: (context, value, child) {
              return value
                  ? Container(
                      width: myWidth,
                      height: myHeight,
                      decoration: const BoxDecoration(
                        color: Color.fromARGB(103, 190, 190, 190),
                      ),
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

  String formatDate(String date) {
    if (date == "") return "";

    DateTime dateTime = DateTime.parse(date).toLocal();
    return DateFormat("dd/MM/yyyy HH:mm").format(dateTime);
  }

  Widget vehicles(List<VehicleEntry> vehicles) {
    return ListView.builder(
      itemCount: vehicles.length,
      scrollDirection: Axis.vertical,
      itemBuilder: (_, index) {
        VehicleEntry vei = vehicles[index];

        return Padding(
          padding: const EdgeInsets.all(6.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              VehicleItemList(
                myWidth: sizeScreen,
                myPlaca: vei.placa.toString(),
                myDodelDesc: vei.modelDescription.toString(),
                myClientName: vei.clientCompanyName.toString(),
                myStatusAuth: vei.statusAuthExit.toString(),
                myVehicleNew: vei.vehicleNew.toString(),
                myDateEntry: vei.dateEntry.toString(),
              ),
              Ink(
                width: sizeScreen * 0.12,
                height: 60,
                child: InkWell(
                  onTap: () {
                    clickViewVehicle.value = true;

                    _vehicleService
                        .vehicleId(
                          widget.userLogin.companyId!,
                          widget.userLogin.resaleId!,
                          vei.id!,
                        )
                        .then((onValue) {
                          clickViewVehicle.value = false;
                          // Chama a tela de detalhes
                          Navigator.of(
                            context,
                          ).push(_createRouteDetails(onValue));
                        });
                  },
                  child: Container(
                    width: 50,
                    height: 60,
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(10.0),
                        bottomRight: Radius.circular(10.0),
                      ),
                    ),
                    child: const Icon(Icons.more_horiz, color: Colors.black38),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  deletestorage() async {
    UserLoginSqliteService service = UserLoginSqliteService();
    service.delete();
  }

  Route _createRouteDetails(Vehicle vehicle) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>
          VehicleDetails(vehicleEntry: vehicle, userLogin: widget.userLogin),
      transitionDuration: const Duration(milliseconds: 600),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.ease;

        final tween = Tween(begin: begin, end: end);

        final curvedAnimation = CurvedAnimation(
          parent: animation,
          curve: curve,
        );

        return SlideTransition(
          position: tween.animate(curvedAnimation),
          child: child,
        );
      },
    );
  }
}
