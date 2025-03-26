import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/presentation/pages/main_page.dart';
import 'package:app_concierge/features/presentation/widgets/myTextField.dart';
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
      backgroundColor: Colors.grey.shade100,
      body: SizedBox(
        width: myWidth,
        height: myHeight,
        child: Stack(
          children: [
            Column(
              children: [
                const Expanded(
                  flex: 1,
                  child: SizedBox(),
                ),
                 Icon(
                  Icons.lock,
                  size: sizeScreen * 0.2,
                ),
                const SizedBox(
                  height: 50,
                ),
                //Welcome text
                Text(
                  "Bem Vindo\n Controle de acesso de véiculos",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey.shade700,
                    fontSize: sizeScreen * 0.04,
                  ),
                ),
                const SizedBox(
                  height: 25,
                ),

                //Usúario
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Mytextfield(
                    myKey: userKey,
                    myController: userController,
                    myLabelText: "Usuário",
                    myKeyboardType: TextInputType.emailAddress,
                    myTextInputAction: TextInputAction.next,
                  ),
                ),
                const SizedBox(
                  height: 10,
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
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                        fontSize: 16),
                    decoration: InputDecoration(
                      fillColor: Colors.grey.shade200,
                      filled: true,
                      labelText: "Senha",
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            myObscureText = !myObscureText;
                          });
                        },
                        icon: Icon(myObscureText
                            ? Icons.visibility_off
                            : Icons.visibility),
                      ),
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.grey.shade700,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey.shade100),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(10.0),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.grey.shade400),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(10.0),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 25,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () {},
                        child: Text(
                          "Esqueceu a senha?",
                          style: TextStyle(color: Colors.grey.shade700),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 25,
                ),
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
                          userController.text, passwordController.text);

                      clickLogin.value = false;

                      if (userLogin.token != kERRORUNAUTHORIZED) {
                        saveStorage(userLogin);

                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MainPage(
                              userLogin: userLogin,
                            ),
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
                      backgroundColor:
                          const WidgetStatePropertyAll<Color>(Colors.blue),
                      padding:  WidgetStatePropertyAll<EdgeInsetsGeometry>(
                          EdgeInsets.symmetric(
                              horizontal: sizeScreen * 0.36, vertical: 16.0)),
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
                          fontSize: 16),
                    ),
                  ),
                ),

                const Expanded(
                  flex: 1,
                  child: SizedBox(
                    height: 25,
                  ),
                ),
              ],
            ),
            ValueListenableBuilder(
              valueListenable: clickLogin,
              builder: (context, value, child) {
                return value
                    ? Container(
                        width: myWidth,
                        height: myHeight,
                        decoration: const BoxDecoration(
                            color: Color.fromARGB(103, 190, 190, 190)),
                        child: const Center(
                          child: CircularProgressIndicator(
                            color: Colors.blue,
                            strokeWidth: 2,
                          ),
                        ))
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
