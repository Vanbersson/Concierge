import 'package:app_concierge/utils/components/myTextFormField.dart';
import 'package:flutter/material.dart';

import '../models/user.dart';
import '../services/api/login_api.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final loginKey = GlobalKey<FormFieldState>();
  final passwordKey = GlobalKey<FormFieldState>();

  var loginController = TextEditingController();
  var passwordController = TextEditingController();

  ValueNotifier<bool>? isRememberPassword = ValueNotifier(false);

 void login() async{
    var user = User();
    user.login = loginController.text;
    user.password = passwordController.text;


    var login = LoginApi();
    login.login(user);

  }

  @override
  Widget build(BuildContext context) {
    final smallerSize = MediaQuery.of(context).size.shortestSide;

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              width: smallerSize,
              height: smallerSize * 0.7,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'AutoPoint',
                    style: TextStyle(
                        fontSize: smallerSize * 0.14,
                        fontWeight: FontWeight.w600,
                        foreground: Paint()
                          ..style = PaintingStyle.stroke
                          ..strokeWidth = 4
                          ..color = Colors.grey),
                  ),
                  Text(
                    'Welcome',
                    style: TextStyle(
                        color: Colors.black54,
                        fontSize: smallerSize * 0.08,
                        fontWeight: FontWeight.w900),
                  ),
                  Text(
                    'Concierge',
                    style: TextStyle(
                        color: Colors.grey,
                        fontSize: smallerSize * 0.04,
                        fontWeight: FontWeight.w400),
                  ),
                ],
              ),
            ),
            Center(
              child: Card(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: smallerSize * 0.06),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        height: smallerSize * 0.06,
                      ),
                      Row(
                        children: [
                          Text(
                            'Log in',
                            style: TextStyle(
                                color: Colors.black54,
                                fontSize: smallerSize * 0.08,
                                fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Text(
                            'Login in to your account',
                            style: TextStyle(
                                color: Colors.grey,
                                fontSize: smallerSize * 0.04,
                                fontWeight: FontWeight.w400),
                          ),
                        ],
                      ),

                      SizedBox(
                        height: smallerSize * 0.04,
                      ),
                      //Login
                      MyTextFormField(
                        smallerSize: smallerSize,
                        myHintText: 'Login',
                        myControler: loginController,
                        myKey: loginKey,
                        myBorderRadius: smallerSize * 0.02,
                        myPrefixIcon: const Icon(Icons.person),
                        myTextInputAction: TextInputAction.next,
                        mykeyboardType: TextInputType.emailAddress,
                        isPassword: false,
                      ),

                      SizedBox(
                        height: smallerSize * 0.02,
                      ),

                      //Pasword
                      MyTextFormField(
                        smallerSize: smallerSize,
                        myHintText: 'Password',
                        myControler: passwordController,
                        myKey: passwordKey,
                        myBorderRadius: smallerSize * 0.02,
                        myPrefixIcon: const Icon(Icons.person),
                        myTextInputAction: TextInputAction.done,
                        mykeyboardType: TextInputType.emailAddress,
                        isPassword: true,
                      ),

                      SizedBox(
                        height: smallerSize * 0.04,
                      ),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          //Remember password
                          Row(
                            children: [
                              ValueListenableBuilder(
                                valueListenable: isRememberPassword!,
                                builder: (context, bool? isCheck, child) =>
                                    Checkbox(
                                  value: isCheck,
                                  onChanged: (bool? value) {
                                    if (value != null) {
                                      isRememberPassword!.value = value;
                                    }
                                  },
                                ),
                              ),
                              GestureDetector(
                                onTap: () => isRememberPassword!.value =
                                    !isRememberPassword!.value,
                                child: Text(
                                  'Remember',
                                  style: TextStyle(
                                      color: Colors.grey,
                                      fontSize: smallerSize * 0.04,
                                      fontWeight: FontWeight.w300),
                                ),
                              ),
                            ],
                          ),
                          //Forgot Password
                          TextButton(
                            onPressed: () {},
                            child: Text(
                              'Forgot password?',
                              style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: smallerSize * 0.04,
                                  fontWeight: FontWeight.w300),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(
                        height: smallerSize * 0.04,
                      ),

                      //Button
                      SizedBox(
                        width: smallerSize,
                        child: ElevatedButton(
                          onPressed: ()  {
                            //Valid Fields
                            if (loginKey.currentState!.validate() &&
                                passwordKey.currentState!.validate()) {
                              //Reset validation
                              loginKey.currentState!.reset();
                              passwordKey.currentState!.reset();

                              login();
                            } else {}
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: EdgeInsets.symmetric(
                                vertical: smallerSize * 0.04),
                            shape: RoundedRectangleBorder(
                                borderRadius:
                                    BorderRadius.circular(smallerSize * 0.02)),
                          ),
                          child: Text(
                            'Logar',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: smallerSize * 0.05,
                                fontWeight: FontWeight.w700),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: smallerSize * 0.08,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SizedBox(
              width: smallerSize,
              height: smallerSize * 0.52,
              child: Center(
                child: Text(
                  'Acesse nosso site para mais informações',
                  style: TextStyle(
                      color: Colors.grey,
                      fontSize: smallerSize * 0.04,
                      fontWeight: FontWeight.w400),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
