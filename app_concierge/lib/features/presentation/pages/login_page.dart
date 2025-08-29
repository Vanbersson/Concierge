import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/presentation/pages/main_page.dart';
import 'package:app_concierge/services/login/login_service.dart';
import 'package:flutter/material.dart';

import 'package:app_concierge/core/constants/message_constants.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  double sizeScreen = 0;
  final userController = TextEditingController();
  final userKey = GlobalKey<FormFieldState>();
  final passwordController = TextEditingController();
  final passworKey = GlobalKey<FormFieldState>();

  bool myObscureText = true;

  ValueNotifier<bool> clickLogin = ValueNotifier(false);

  LoginService loginservice = LoginService();
  UserLogin userLogin = UserLogin();

  @override
  Widget build(BuildContext context) {
    var myWidth = MediaQuery.of(context).size.width;
    var myHeight = MediaQuery.of(context).size.height;
    sizeScreen = MediaQuery.of(context).size.shortestSide;

    return Scaffold(
      body: Container(
        width: myWidth,
        height: myHeight,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blue, Colors.grey, Colors.blue],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              top: myWidth / 6,
              left: myWidth / 14,
              child: Image.asset(
                "assets/icons/icon-1.png",
                width: 60,
                fit: BoxFit.cover,
              ),
            ),
            Positioned(
              top: myWidth / 3,
              right: myWidth / 12,
              child: Image.asset(
                "assets/icons/icon-2.png",
                width: 60,
                fit: BoxFit.cover,
              ),
            ),
            Positioned(
              bottom: myWidth / 4,
              left: myWidth / 12,
              child: Image.asset(
                "assets/icons/icon-3.png",
                width: 60,
                fit: BoxFit.cover,
              ),
            ),

            Column(
              children: [
                const Expanded(flex: 1, child: SizedBox()),
                Text(
                  "Portaria",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: sizeScreen * 0.07,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 50),
                //Welcome text
                Text(
                  "Bem-vindo",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.black87,
                    fontSize: sizeScreen * 0.045,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  "Informe seu email e senha para acessar.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.black54,
                    fontSize: sizeScreen * 0.035,
                  ),
                ),
                const SizedBox(height: 15),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Align(
                    alignment: Alignment.topLeft,
                    child: Text(
                      "E-mail",
                      style: TextStyle(
                        color: Colors.black87,
                        fontSize: sizeScreen * 0.045,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                //Usúario
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: TextFormField(
                    key: userKey,
                    validator: (text) {
                      if (text == null || text.trim().isEmpty) {
                        return "E-mail inválido!";
                      }
                      return null;
                    },
                    onTapOutside: (event) => FocusScope.of(context).unfocus(),
                    controller: userController,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    maxLength: 100,
                    maxLines: 1,
                    enabled: true,
                    style: TextStyle(
                      color: Colors.black54,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    decoration: InputDecoration(
                      counterText: "",
                      fillColor: Colors.grey.shade200,
                      filled: true,
                      labelText: "",
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                      enabledBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      errorBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      focusedErrorBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                    ),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Align(
                    alignment: Alignment.topLeft,
                    child: Text(
                      "Senha",
                      style: TextStyle(
                        color: Colors.black87,
                        fontSize: sizeScreen * 0.045,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                //Senha
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: TextFormField(
                    key: passworKey,
                    validator: (text) {
                      if (text == null || text.trim().isEmpty) {
                        return "Campo Inválido!";
                      }
                      return null;
                    },
                    onTapOutside: (event) => FocusScope.of(context).unfocus(),
                    controller: passwordController,
                    obscureText: myObscureText,
                    style: const TextStyle(
                      color: Colors.black54,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    decoration: InputDecoration(
                      fillColor: Colors.grey.shade200,
                      filled: true,
                      labelText: "",
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            myObscureText = !myObscureText;
                          });
                        },
                        icon: Icon(
                          myObscureText
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                      ),
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                      enabledBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      errorBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      focusedErrorBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.transparent),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 25),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () {},
                        child: const Text(
                          "Esqueceu a senha?",
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 25),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      if (userKey.currentState?.validate() == false ||
                          passworKey.currentState?.validate() == false) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Existem campos inválidos.'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }
                      clickLogin.value = true;

                      userLogin = await loginservice.login(
                        userController.text,
                        passwordController.text,
                      );

                      clickLogin.value = false;

                      if (userLogin.token != kERRORUNAUTHORIZED) {
                        saveStorage(userLogin);

                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                MainPage(userLogin: userLogin),
                          ),
                        );
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Login inválido.'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                    style: ButtonStyle(
                      elevation: const WidgetStatePropertyAll<double>(8.0),
                      backgroundColor: const WidgetStatePropertyAll<Color>(
                        Colors.blue,
                      ),
                      padding: WidgetStatePropertyAll<EdgeInsetsGeometry>(
                        EdgeInsets.symmetric(
                          horizontal: sizeScreen * 0.36,
                          vertical: 16.0,
                        ),
                      ),
                      shape: WidgetStatePropertyAll<RoundedRectangleBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                      ),
                    ),
                    child: const Text(
                      "Acessar",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),

                const Expanded(flex: 1, child: SizedBox(height: 25)),
                Text(
                  "Aplicativo para controle de entrada de veículos.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w400,
                    fontSize: sizeScreen * 0.03,
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ),

            //Load
            ValueListenableBuilder(
              valueListenable: clickLogin,
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
      ),
    );
  }

  saveStorage(UserLogin login) async {
    UserLoginSqliteService service = UserLoginSqliteService();
    service.save(login);
  }
}
