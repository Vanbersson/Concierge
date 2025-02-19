// ignore_for_file: use_build_context_synchronously

import 'dart:async';

import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/features/presentation/pages/login_page.dart';
import 'package:app_concierge/features/presentation/pages/main_page.dart';
import 'package:flutter/material.dart';

import 'package:app_concierge/core/constants/message_constants.dart';
import 'package:lottie/lottie.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with TickerProviderStateMixin {
  bool isLogin = false;
  late final AnimationController _controller;
  UserLogin userLogin = UserLogin();

  @override
  void initState() {
    _controller = AnimationController(vsync: this);
    login();
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade200,
      body: Center(
        child: Lottie.asset(
          "assets/lotties/animation-loading.json",
          width: 200.0,
          controller: _controller,
          onLoaded: (composition) {
            _controller
              ..duration = composition.duration
              ..forward().then((value) {
                if (userLogin.token == kERRORUNAUTHORIZED) {
                  openLogin();
                } else {
                  openMain();
                }
              });
          },
        ),
      ),
    );
  }

  login() async {
    UserLoginSqliteService service = UserLoginSqliteService();
    userLogin = await service.userLogin();
  }

  openLogin() {
    Navigator.pop(context);
    Navigator.push(
        context, MaterialPageRoute(builder: (myContext) => const LoginPage()));
  }

  openMain() {
    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (myContext) => MainPage(
          userLogin: userLogin,
        ),
      ),
    );
  }
}
