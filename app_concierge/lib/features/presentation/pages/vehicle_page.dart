import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:app_concierge/features/domain/user/user_attendant.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_provider.dart';
import 'package:app_concierge/features/presentation/widgets/mytextfield.dart';
import 'package:camera_camera/camera_camera.dart';
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:provider/provider.dart';

class VehiclePage extends StatefulWidget {
  List<VehicleModel> model;
  List<UserAttendant> attendants;
  VehiclePage({super.key, required this.model, required this.attendants});

  @override
  State<VehiclePage> createState() => _VehiclePageState();
}

class _VehiclePageState extends State<VehiclePage> {
  late Vehicle _vehicle;

  final ValueNotifier<bool> isvehicleNew = ValueNotifier(false);
  final ValueNotifier<bool> isvehicleService = ValueNotifier(false);

  List<String> colors = <String>[
    'Branco',
    'Preto',
    'Azul',
    'Verde',
    'Cinza',
    'Vermelho',
    'Amarelo',
    'Rosa',
    'Roxo',
    'Outro'
  ];

  final placaKey = GlobalKey<FormFieldState>();
  final placaControler = TextEditingController();
  var maskFormatterPlaca = MaskTextInputFormatter(
      mask: '###-####',
      filter: {"#": RegExp(r'[0-9 A-Z]')},
      type: MaskAutoCompletionType.lazy);

  final frotaKey = GlobalKey<FormFieldState>();
  final frotaControler = TextEditingController();

  final kmKey = GlobalKey<FormFieldState>();
  final kmControler = TextEditingController();

  final extinguisherKey = GlobalKey<FormFieldState>();
  final extinguisherControler = TextEditingController();
  final coneKey = GlobalKey<FormFieldState>();
  final coneControler = TextEditingController();
  final tireKey = GlobalKey<FormFieldState>();
  final tireControler = TextEditingController();
  final tirecompleteKey = GlobalKey<FormFieldState>();
  final tirecompleteControler = TextEditingController();
  final toolboxKey = GlobalKey<FormFieldState>();
  final toolboxControler = TextEditingController();

  late ValueNotifier<Uint8List> photo1;
  late ValueNotifier<Uint8List> photo2;
  late ValueNotifier<Uint8List> photo3;
  late ValueNotifier<Uint8List> photo4;

  final infKey = GlobalKey<FormFieldState>();
  final infControler = TextEditingController();

  @override
  void initState() {
    _vehicle = Vehicle();
    photo1 = ValueNotifier<Uint8List>(Uint8List(0));
    photo2 = ValueNotifier<Uint8List>(Uint8List(0));
    photo3 = ValueNotifier<Uint8List>(Uint8List(0));
    photo4 = ValueNotifier<Uint8List>(Uint8List(0));
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Expanded(flex: 2, child: SizedBox()),
                //Check
                const Center(
                  child: Text(
                    "Marque se o veículo e novo ou se vai fazer serviço",
                    style: TextStyle(fontSize: 16, color: Colors.black87),
                  ),
                ),
                Row(
                  children: [
                    ValueListenableBuilder(
                        valueListenable: isvehicleNew,
                        builder:
                            (BuildContext context, bool value, Widget? child) {
                          return Row(
                            children: [
                              Checkbox(
                                value: value,
                                checkColor: Colors.black54,
                                activeColor: Colors.green.shade300,
                                onChanged: (bool? sele) {
                                  isvehicleNew.value = sele!;
                                  placaControler.text = "";
                                },
                              ),
                              GestureDetector(
                                  onTap: () {
                                    isvehicleNew.value = !isvehicleNew.value;
                                    placaControler.text = "";
                                  },
                                  child: const Text("Vehiculo é novo!")),
                            ],
                          );
                        }),
                    const Expanded(
                      flex: 1,
                      child: SizedBox(),
                    ),
                    ValueListenableBuilder(
                        valueListenable: isvehicleService,
                        builder:
                            (BuildContext context, bool value, Widget? child) {
                          return Row(
                            children: [
                              Checkbox(
                                value: value,
                                checkColor: Colors.black54,
                                activeColor: Colors.green.shade300,
                                onChanged: (bool? sele) {
                                  isvehicleService.value = sele!;
                                },
                              ),
                              GestureDetector(
                                  onTap: () => isvehicleService.value =
                                      !isvehicleService.value,
                                  child: const Text("Ordem serviço!")),
                            ],
                          );
                        }),
                  ],
                ),
                const SizedBox(
                  height: 10,
                ),
                //Model Color
                Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Modelos",
                          style: TextStyle(
                              fontWeight: FontWeight.w300,
                              fontSize: 16.0,
                              color: Colors.black87),
                        ),
                        DropdownMenu<String>(
                         // initialSelection: widget.model.first.description,
                          width: 220,
                          trailingIcon: Icon(
                            Icons.search,
                            color: Colors.deepOrange.shade300,
                          ),
                          selectedTrailingIcon: Icon(
                            Icons.search,
                            color: Colors.deepOrange.shade300,
                          ),
                          menuStyle: const MenuStyle(
                            elevation: WidgetStatePropertyAll<double>(10),
                          ),
                          onSelected: (String? value) {
                          
                            for (var m in widget.model) {
                              if(value == m.id.toString()){
                                _vehicle.modelId = m.id;
                                _vehicle.modelDescription = m.description;
                              }
                            }

                          },
                          dropdownMenuEntries: widget.model
                              .map<DropdownMenuEntry<String>>(
                                  (VehicleModel value) {
                            return DropdownMenuEntry<String>(
                              value: value.id!.toString(),
                              label: value.description!,
                              labelWidget: Text(
                                value.description!.toString(),
                                style: const TextStyle(fontSize: 16),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const Expanded(child: SizedBox()),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Cor",
                          style: TextStyle(
                              fontWeight: FontWeight.w300,
                              fontSize: 16,
                              color: Colors.black87),
                        ),
                        DropdownMenu<String>(
                         // initialSelection: colors.first,
                          width: 160,
                          trailingIcon: Icon(
                            Icons.search,
                            color: Colors.deepOrange.shade300,
                          ),
                          selectedTrailingIcon: Icon(
                            Icons.search,
                            color: Colors.deepOrange.shade300,
                          ),
                          menuStyle: const MenuStyle(
                            elevation: WidgetStatePropertyAll<double>(10),
                          ),
                          onSelected: (String? value) {
                            _vehicle.color = value;
                          },
                          dropdownMenuEntries: colors
                              .map<DropdownMenuEntry<String>>((String value) {
                            return DropdownMenuEntry<String>(
                              value: value,
                              label: value,
                              labelWidget: Text(
                                value,
                                style: const TextStyle(fontSize: 16.0),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(
                  height: 10.0,
                ),
                Row(
                  children: [
                    SizedBox(
                      width: 190,
                      child: ValueListenableBuilder(
                          valueListenable: isvehicleNew,
                          builder: (BuildContext context, bool value,
                              Widget? child) {
                            return Mytextfield(
                              myKey: placaKey,
                              myController: placaControler,
                              myLabelText: "Placa",
                              myKeyboardType: TextInputType.text,
                              myTextInputAction: TextInputAction.next,
                              myTextColor: Colors.black87,
                              myEnabled: !value,
                              maskText: maskFormatterPlaca,
                              myTextCapitalization:
                                  TextCapitalization.characters,
                            );
                          }),
                    ),
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: 190,
                      child: Mytextfield(
                        myKey: frotaKey,
                        myController: frotaControler,
                        myLabelText: "Frota",
                        myKeyboardType: TextInputType.text,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 10,
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 10.0,
                ),
                SizedBox(
                  width: 400,
                  child: Mytextfield(
                    myKey: kmKey,
                    myController: kmControler,
                    myLabelText: "KM",
                    myKeyboardType: TextInputType.number,
                    myTextInputAction: TextInputAction.done,
                    myTextColor: Colors.black87,
                    myMaxLength: 10,
                  ),
                ),
                //Attendant
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Consultor",
                      style: TextStyle(
                          fontWeight: FontWeight.w300,
                          fontSize: 16,
                          color: Colors.black87),
                    ),
                    DropdownMenu<String>(
                      initialSelection: widget.attendants.first.name,
                      width: 390,
                      trailingIcon: Icon(
                        Icons.search,
                        color: Colors.deepOrange.shade300,
                      ),
                      selectedTrailingIcon: Icon(
                        Icons.search,
                        color: Colors.deepOrange.shade300,
                      ),
                      menuStyle: const MenuStyle(
                        elevation: WidgetStatePropertyAll<double>(10),
                      ),
                      onSelected: (String? value) {
                        print(value);
                      },
                      dropdownMenuEntries: widget.attendants
                          .map<DropdownMenuEntry<String>>(
                              (UserAttendant value) {
                        return DropdownMenuEntry<String>(
                          value: value.id!.toString(),
                          label: value.name!,
                          labelWidget: Text(
                            value.name!.toString(),
                            style: const TextStyle(fontSize: 16),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 10.0,
                ),
                Row(
                  children: [
                    SizedBox(
                      width: 125,
                      child: Mytextfield(
                        myKey: extinguisherKey,
                        myController: extinguisherControler,
                        myLabelText: "Extintor",
                        myKeyboardType: TextInputType.number,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 3,
                      ),
                    ),
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: 125,
                      child: Mytextfield(
                        myKey: coneKey,
                        myController: coneControler,
                        myLabelText: "Cone",
                        myKeyboardType: TextInputType.number,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 3,
                      ),
                    ),
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: 125,
                      child: Mytextfield(
                        myKey: tireKey,
                        myController: tireControler,
                        myLabelText: "Pneu",
                        myKeyboardType: TextInputType.number,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 3,
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 10.0,
                ),
                Row(
                  children: [
                    SizedBox(
                      width: 190,
                      child: Mytextfield(
                        myKey: tirecompleteKey,
                        myController: tirecompleteControler,
                        myLabelText: "Pneu Completo",
                        myKeyboardType: TextInputType.number,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 3,
                      ),
                    ),
                    const Expanded(child: SizedBox()),
                    SizedBox(
                      width: 190,
                      child: Mytextfield(
                        myKey: toolboxKey,
                        myController: toolboxControler,
                        myLabelText: "Cx. Ferramenta",
                        myKeyboardType: TextInputType.number,
                        myTextInputAction: TextInputAction.next,
                        myTextColor: Colors.black87,
                        myMaxLength: 3,
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 10.0,
                ),
                //Information
                SizedBox(
                  width: 400,
                  child: Mytextfield(
                    myKey: infKey,
                    myController: infControler,
                    myLabelText: "Informações",
                    myKeyboardType: TextInputType.text,
                    myTextInputAction: TextInputAction.done,
                    myTextColor: Colors.black87,
                    myMaxLines: 4,
                    myMaxLength: 255,
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Row(
                  children: [
                    //Photo 1
                    ValueListenableBuilder(
                      valueListenable: photo1,
                      builder: (context, value, child) {
                        return Column(
                          children: [
                            vehiclePhoto(base64Encode(value)),
                            const SizedBox(
                              height: 8,
                            ),
                            value.isEmpty
                                ? IconButton(
                                    onPressed: () {
                                      openCamera1(context);
                                    },
                                    icon: const Icon(
                                      Icons.camera_alt,
                                      color: Colors.black87,
                                      size: 30,
                                    ),
                                  )
                                : IconButton(
                                    onPressed: () {
                                      photo1.value = Uint8List(0);
                                      _vehicle.photo1 = "";
                                    },
                                    icon: const Icon(
                                      Icons.close,
                                      color: Colors.red,
                                      size: 30,
                                    ),
                                  )
                          ],
                        );
                      },
                    ),
                    const Expanded(flex: 1, child: SizedBox()),
                    //Photo 2
                    ValueListenableBuilder(
                      valueListenable: photo2,
                      builder: (context, value, child) {
                        return Column(
                          children: [
                            vehiclePhoto(base64Encode(value)),
                            const SizedBox(
                              height: 8,
                            ),
                            value.isEmpty
                                ? IconButton(
                                    onPressed: () {
                                      openCamera2(context);
                                    },
                                    icon: const Icon(
                                      Icons.camera_alt,
                                      color: Colors.black87,
                                      size: 30,
                                    ),
                                  )
                                : IconButton(
                                    onPressed: () {
                                      photo2.value = Uint8List(0);
                                      _vehicle.photo2 = "";
                                    },
                                    icon: const Icon(
                                      Icons.close,
                                      color: Colors.red,
                                      size: 30,
                                    ),
                                  )
                          ],
                        );
                      },
                    ),
                    const Expanded(flex: 1, child: SizedBox()),
                    //Photo 3
                    ValueListenableBuilder(
                      valueListenable: photo3,
                      builder: (context, value, child) {
                        return Column(
                          children: [
                            vehiclePhoto(base64Encode(value)),
                            const SizedBox(
                              height: 8,
                            ),
                            value.isEmpty
                                ? IconButton(
                                    onPressed: () {
                                      openCamera3(context);
                                    },
                                    icon: const Icon(
                                      Icons.camera_alt,
                                      color: Colors.black87,
                                      size: 30,
                                    ),
                                  )
                                : IconButton(
                                    onPressed: () {
                                      photo3.value = Uint8List(0);
                                      _vehicle.photo3 = "";
                                    },
                                    icon: const Icon(
                                      Icons.close,
                                      color: Colors.red,
                                      size: 30,
                                    ),
                                  )
                          ],
                        );
                      },
                    ),
                    const Expanded(flex: 1, child: SizedBox()),
                    //Photo 4
                    ValueListenableBuilder(
                      valueListenable: photo4,
                      builder: (context, value, child) {
                        return Column(
                          children: [
                            vehiclePhoto(base64Encode(value)),
                            const SizedBox(
                              height: 8,
                            ),
                            value.isEmpty
                                ? IconButton(
                                    onPressed: () {
                                      openCamera4(context);
                                    },
                                    icon: const Icon(
                                      Icons.camera_alt,
                                      color: Colors.black87,
                                      size: 30,
                                    ),
                                  )
                                : IconButton(
                                    onPressed: () {
                                      photo4.value = Uint8List(0);
                                      _vehicle.photo4 = "";
                                    },
                                    icon: const Icon(
                                      Icons.close,
                                      color: Colors.red,
                                      size: 30,
                                    ),
                                  )
                          ],
                        );
                      },
                    ),
                  ],
                ),

                const Expanded(flex: 1, child: SizedBox()),
                //Add
                ElevatedButton(
                  onPressed: () {
                    _vehicle.placa = placaControler.text;
                    context.read<VehicleProvider>().add(_vehicle);
                    Navigator.pop(context);
                  },
                  style: ButtonStyle(
                    elevation: const WidgetStatePropertyAll<double>(8.0),
                    backgroundColor:
                        WidgetStatePropertyAll<Color>(Colors.blue.shade300),
                    padding: const WidgetStatePropertyAll<EdgeInsetsGeometry>(
                        EdgeInsets.symmetric(
                            horizontal: 160.0, vertical: 16.0)),
                    shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                  ),
                  child: const Text(
                    "Adcionar",
                    style: TextStyle(color: Colors.black87),
                  ),
                ),
                const SizedBox(height: 20.0),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void openCamera1(BuildContext context) async {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => CameraCamera(
                  onFile: (file) {
                    if (file != null) {
                      fileToBase64PPhoto1(file.path);
                      Navigator.pop(context);
                    }
                  },
                )));
  }

  void fileToBase64PPhoto1(String filePath) async {
    File file = File(filePath);
    photo1.value = await file.readAsBytes();
    _vehicle.photo1 = base64Encode(photo1.value);
  }

  void openCamera2(BuildContext context) async {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => CameraCamera(
                  onFile: (file) {
                    if (file != null) {
                      fileToBase64PPhoto2(file.path);
                      Navigator.pop(context);
                    }
                  },
                )));
  }

  void fileToBase64PPhoto2(String filePath) async {
    File file = File(filePath);
    photo2.value = await file.readAsBytes();
    _vehicle.photo2 = base64Encode(photo2.value);
  }

  void openCamera3(BuildContext context) async {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => CameraCamera(
                  onFile: (file) {
                    if (file != null) {
                      fileToBase64PPhoto3(file.path);
                      Navigator.pop(context);
                    }
                  },
                )));
  }

  void fileToBase64PPhoto3(String filePath) async {
    File file = File(filePath);
    photo3.value = await file.readAsBytes();
    _vehicle.photo3 = base64Encode(photo3.value);
  }

  void openCamera4(BuildContext context) async {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => CameraCamera(
                  onFile: (file) {
                    if (file != null) {
                      fileToBase64PPhoto4(file.path);
                      Navigator.pop(context);
                    }
                  },
                )));
  }

  void fileToBase64PPhoto4(String filePath) async {
    File file = File(filePath);
    photo4.value = await file.readAsBytes();
    _vehicle.photo4 = base64Encode(photo4.value);
  }

  Widget vehiclePhoto(String photo) {
    return photo != ""
        ? ClipRRect(
            borderRadius: BorderRadius.circular(10.0),
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
