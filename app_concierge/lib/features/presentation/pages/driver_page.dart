import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';

import 'package:app_concierge/features/domain/user/user_driver.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/presentation/pages/vehicle_add_page.dart';
import 'package:app_concierge/features/presentation/widgets/mytextfield.dart';
import 'package:flutter/material.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';

import 'package:camera_camera/camera_camera.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class DriverPage extends StatefulWidget {
  UserLogin userLogin;
  DriverPage({super.key, required this.userLogin});

  @override
  State<DriverPage> createState() => _DriverPageState();
}

class _DriverPageState extends State<DriverPage> {
  double sizeScreen = 0;
  late UserDriver _userDriver;

  final nameKey = GlobalKey<FormFieldState>();
  final nameControler = TextEditingController();
  final cpfKey = GlobalKey<FormFieldState>();
  final cpfControler = TextEditingController();
  var maskFormatterCpf = MaskTextInputFormatter(
    mask: '###.###.###-##',
    filter: {"#": RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );
  final rgKey = GlobalKey<FormFieldState>();
  final rgControler = TextEditingController();

  late ValueNotifier<Uint8List> photoDriver;
  late ValueNotifier<Uint8List> doc1Driver;
  late ValueNotifier<Uint8List> doc2Driver;

  @override
  void initState() {
    _userDriver = UserDriver();
    photoDriver = ValueNotifier<Uint8List>(Uint8List(0));
    doc1Driver = ValueNotifier<Uint8List>(Uint8List(0));
    doc2Driver = ValueNotifier<Uint8List>(Uint8List(0));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final widght = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;
    sizeScreen = MediaQuery.of(context).size.shortestSide;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 24, left: 24),
            child: SingleChildScrollView(
              child: SizedBox(
                width: widght,
                height: height,
                child: Column(
                  children: [
                    const Expanded(flex: 1, child: SizedBox()),
                    const Text(
                      "Vamos informar os dados do motorista",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                        color: Colors.black87,
                      ),
                    ),
                    const Row(
                      children: [
                        Text(
                          "Por favor informe os dados corretamente.",
                          style: TextStyle(
                            fontWeight: FontWeight.w300,
                            fontSize: 16,
                            color: Colors.black87,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 25.0),
                    //Photo driver
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade700,
                        borderRadius: BorderRadius.circular(100.0),
                      ),
                      child: ValueListenableBuilder(
                        valueListenable: photoDriver,
                        builder: (context, value, child) {
                          return value.isNotEmpty
                              ? CircleAvatar(
                                  backgroundImage: MemoryImage(value),
                                )
                              : const CircleAvatar();
                        },
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextButton(
                          onPressed: () {
                            openCamera1(context);
                          },
                          child: const Text(
                            "Foto motorista",
                            style: TextStyle(
                              fontWeight: FontWeight.w300,
                              fontSize: 16,
                              color: Colors.blue,
                            ),
                          ),
                        ),
                        ValueListenableBuilder(
                          valueListenable: photoDriver,
                          builder: (context, value, child) {
                            return value.isNotEmpty
                                ? IconButton(
                                    onPressed: () {
                                      //Clean photo
                                      photoDriver.value = Uint8List(0);
                                      _userDriver.photo = "";
                                    },
                                    icon: const Icon(
                                      Icons.clear,
                                      color: Colors.red,
                                    ),
                                  )
                                : const SizedBox();
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 40.0),
                    Mytextfield(
                      myKey: nameKey,
                      myController: nameControler,
                      myLabelText: "Nome",
                      myKeyboardType: TextInputType.text,
                      myTextInputAction: TextInputAction.next,
                      myMaxLength: 100,
                      myTextColor: Colors.black87,
                    ),
                    const SizedBox(height: 10),
                    Mytextfield(
                      myKey: cpfKey,
                      myController: cpfControler,
                      myLabelText: "CPF",
                      myKeyboardType: TextInputType.number,
                      myTextInputAction: TextInputAction.next,
                      maskText: maskFormatterCpf,
                      myTextColor: Colors.black87,
                    ),
                    const SizedBox(height: 10),
                    Mytextfield(
                      myKey: rgKey,
                      myController: rgControler,
                      myLabelText: "Rg",
                      myKeyboardType: TextInputType.number,
                      myTextInputAction: TextInputAction.done,
                      myMaxLength: 11,
                      myTextColor: Colors.black87,
                    ),
                    const SizedBox(height: 40.0),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        //Doc1
                        Column(
                          children: [
                            Container(
                              width: 100,
                              height: 100,
                              child: ValueListenableBuilder(
                                valueListenable: doc1Driver,
                                builder: (context, value, child) {
                                  return value.isNotEmpty
                                      ? CircleAvatar(
                                          backgroundImage: MemoryImage(value),
                                        )
                                      : const CircleAvatar();
                                },
                              ),
                            ),
                            Row(
                              children: [
                                TextButton(
                                  onPressed: () {
                                    openCamera2(context);
                                  },
                                  child: Text(
                                    "Documento1",
                                    style: TextStyle(
                                      fontWeight: FontWeight.w300,
                                      fontSize: 16,
                                      color: Colors.blue.shade300,
                                    ),
                                  ),
                                ),
                                ValueListenableBuilder(
                                  valueListenable: doc1Driver,
                                  builder: (context, value, child) {
                                    return value.isNotEmpty
                                        ? IconButton(
                                            onPressed: () {
                                              //Clean Doc1
                                              doc1Driver.value = Uint8List(0);
                                              _userDriver.doc1 = "";
                                            },
                                            icon: const Icon(
                                              Icons.clear,
                                              color: Colors.red,
                                            ),
                                          )
                                        : const SizedBox();
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(width: 25.0),
                        //Doc2
                        Column(
                          children: [
                            Container(
                              width: 100,
                              height: 100,
                              child: ValueListenableBuilder(
                                valueListenable: doc2Driver,
                                builder: (context, value, child) {
                                  return value.isNotEmpty
                                      ? CircleAvatar(
                                          backgroundImage: MemoryImage(value),
                                        )
                                      : const CircleAvatar();
                                },
                              ),
                            ),
                            Row(
                              children: [
                                TextButton(
                                  onPressed: () {
                                    openCamera3(context);
                                  },
                                  child: Text(
                                    "Documento2",
                                    style: TextStyle(
                                      fontWeight: FontWeight.w300,
                                      fontSize: 16,
                                      color: Colors.blue.shade300,
                                    ),
                                  ),
                                ),
                                ValueListenableBuilder(
                                  valueListenable: doc2Driver,
                                  builder: (context, value, child) {
                                    return value.isNotEmpty
                                        ? IconButton(
                                            onPressed: () {
                                              //Clean Doc1
                                              doc2Driver.value = Uint8List(0);
                                              _userDriver.doc2 = "";
                                            },
                                            icon: const Icon(
                                              Icons.clear,
                                              color: Colors.red,
                                            ),
                                          )
                                        : const SizedBox();
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Expanded(flex: 1, child: SizedBox()),
                    SizedBox(
                      width: widght - sizeScreen * 0.04,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          if (nameControler.text.isNotEmpty &&
                                  cpfControler.text.isNotEmpty ||
                              rgControler.text.isNotEmpty) {
                            _userDriver.name = nameControler.text;
                            _userDriver.cpf = _removerMaskCpf(
                              cpfControler.text,
                            );
                            _userDriver.rg = rgControler.text;

                            bool result = validDriver(_userDriver);

                            if (result) {
                              Navigator.of(context).push(_createRouteDriver());
                            }
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Motorista não informado.'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        },
                        style: ButtonStyle(
                          elevation: const WidgetStatePropertyAll<double>(8.0),
                          backgroundColor: WidgetStatePropertyAll<Color>(
                            Colors.blue.shade300,
                          ),

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
                    ),
                    const SizedBox(height: 20.0),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  bool validDriver(UserDriver driver) {
    if (driver.cpf!.isNotEmpty) {
      if (driver.cpf!.length != 11) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('CPF invalido.'),
            backgroundColor: Colors.red,
          ),
        );
        return false;
      }
    }

    return true;
  }

  Future<Uint8List?> compressFile(File file) async {
    var result = await FlutterImageCompress.compressWithFile(
      file.absolute.path,
      quality: 68,
    );
    return result;
  }

  void openCamera1(BuildContext context) async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CameraCamera(
          onFile: (file) {
            if (file != null) {
              fileToBase64Photo(file.path);
              Navigator.pop(context);
            }
          },
        ),
      ),
    );
  }

  void fileToBase64Photo(String filePath) async {
    File file = File(filePath);
    photoDriver.value = (await compressFile(file))!;
    _userDriver.photo = base64Encode(photoDriver.value);
  }

  void openCamera2(BuildContext context) async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CameraCamera(
          onFile: (file) {
            if (file != null) {
              fileToBase64PDoc1(file.path);
              Navigator.pop(context);
            }
          },
        ),
      ),
    );
  }

  void fileToBase64PDoc1(String filePath) async {
    File file = File(filePath);
    doc1Driver.value = (await compressFile(file))!;
    _userDriver.doc1 = base64Encode(doc1Driver.value);
  }

  void openCamera3(BuildContext context) async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => CameraCamera(
          onFile: (file) {
            if (file != null) {
              fileToBase64PDoc2(file.path);
              Navigator.pop(context);
            }
          },
        ),
      ),
    );
  }

  void fileToBase64PDoc2(String filePath) async {
    File file = File(filePath);
    doc2Driver.value = (await compressFile(file))!;
    _userDriver.doc2 = base64Encode(doc2Driver.value);
  }

  Route _createRouteDriver() {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>
          VehicleAddPage(userLogin: widget.userLogin, userDriver: _userDriver),
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

  String _removerMaskCpf(String cpf) {
    var mask;
    try {
      var mask = MaskTextInputFormatter(
        mask: "###########",
        filter: {"#": RegExp(r'[0-9]')},
      );
      return mask.maskText(cpf);
    } catch (e) {
      return "";
    }
  }
}
