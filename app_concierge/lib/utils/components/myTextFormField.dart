// ignore_for_file: file_names, must_be_immutable

import 'package:flutter/material.dart';

class MyTextFormField extends StatelessWidget {
  double smallerSize;
  String myHintText;
  TextEditingController myControler;
  Key myKey;
  Icon myPrefixIcon;
  double myBorderRadius;
  bool isPassword;
  TextInputAction myTextInputAction;
  TextInputType mykeyboardType;

  MyTextFormField({
    super.key,
    required this.smallerSize,
    required this.myHintText,
    required this.myControler,
    required this.myKey,
    required this.myPrefixIcon,
    required this.myBorderRadius,
    required this.isPassword,
    required this.myTextInputAction,
    required this.mykeyboardType,
  });

  final passwordChange = PasswordChange();

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(myBorderRadius),
        ),
        child: ListenableBuilder(
          listenable: passwordChange,
          builder: (context, child) {
            return TextFormField(
              controller: myControler,
              key: myKey,
              textInputAction: myTextInputAction,
              keyboardType: mykeyboardType,
              obscureText: isPassword ? passwordChange.visiblePassword : false,
              validator: (String? value) {
                if (isPassword) {
                  if (value == null || value.trim().isEmpty) {
                    return "Invalid password!";
                  }
                } else {
                  if (value == null || value.trim().isEmpty) {
                    return "Invalid login!";
                  }
                }

                return null;
              },
              onTapOutside: (event) => FocusScope.of(context).unfocus(),
              style: TextStyle(
                  color: Colors.black54,
                  fontSize: smallerSize * 0.04,
                  fontWeight: FontWeight.w400),
              decoration: InputDecoration(
                hintText: myHintText,
                hintStyle: TextStyle(
                    color: Colors.grey,
                    fontSize: smallerSize * 0.04,
                    fontWeight: FontWeight.w400),
                fillColor: Colors.white,
                filled: true,
                prefixIcon: SizedBox(
                  width: smallerSize * 0.1,
                  child: Row(
                    children: [
                      Container(
                        height: smallerSize * 0.15,
                        width: smallerSize * 0.05,
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(myBorderRadius),
                            topLeft: Radius.circular(myBorderRadius),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                suffixIcon: isPassword
                    ? GestureDetector(
                        child: Icon(
                          passwordChange.visiblePassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color: Colors.grey,
                          size: 25,
                        ),
                        onTap: () {
                          passwordChange
                              .showPassword(!passwordChange.visiblePassword);
                        },
                      )
                    : const SizedBox(),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(myBorderRadius),
                  borderSide: const BorderSide(
                    width: 1,
                    color: Color.fromARGB(90, 175, 165, 159),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(myBorderRadius),
                  borderSide: const BorderSide(
                    width: 1,
                    color: Color.fromARGB(90, 175, 165, 159),
                  ),
                ),
                focusedErrorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(myBorderRadius),
                  borderSide: const BorderSide(
                    width: 1,
                    color: Colors.red,
                  ),
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(myBorderRadius),
                  borderSide: const BorderSide(
                    width: 1,
                    color: Colors.red,
                  ),
                ),
              ),
            );
          },
        ));
  }
}

class PasswordChange extends ChangeNotifier {
  bool visiblePassword = true;

  showPassword(bool show) {
    visiblePassword = show;
    notifyListeners();
  }
}
