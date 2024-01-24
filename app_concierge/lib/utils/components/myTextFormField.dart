import 'package:flutter/material.dart';

// ignore: must_be_immutable
class MyTextFormField extends StatefulWidget {
  BuildContext myContext;
  double smallerSize;
  String myHintText;
  Key myKey;
  Icon myPrefixIcon;
  double myBorderRadius;
  bool isPassword;
  TextInputAction myTextInputAction;
  TextInputType mykeyboardType;
  Function response;
  Function valid;

  MyTextFormField(
      {super.key,
      required this.myContext,
      required this.smallerSize,
      required this.myHintText,
      required this.myKey,
      required this.myPrefixIcon,
      required this.myBorderRadius,
      required this.isPassword,
      required this.myTextInputAction,
      required this.mykeyboardType,
      required this.response,
      required this.valid});

  @override
  State<MyTextFormField> createState() => _MyTextFormFieldState();
}

class _MyTextFormFieldState extends State<MyTextFormField> {
  bool showPassword = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(widget.myBorderRadius),
      ),
      child: TextFormField(
        key: widget.myKey,
        textInputAction: widget.myTextInputAction,
        keyboardType: widget.mykeyboardType,
        obscureText: widget.isPassword ? showPassword : false,
        onChanged: (value) {
          widget.response(value);
        },
        validator: (value) {
          if (value == null || value.trim().isEmpty) {
            return null;
          }

          return value;
        },
        onTapOutside: (event) => FocusScope.of(widget.myContext).unfocus(),
        style: TextStyle(
            color: Colors.black54,
            fontSize: widget.smallerSize * 0.04,
            fontWeight: FontWeight.w400),
        decoration: InputDecoration(
          hintText: widget.myHintText,
          hintStyle: TextStyle(
              color: Colors.grey,
              fontSize: widget.smallerSize * 0.04,
              fontWeight: FontWeight.w400),
          fillColor: Colors.white,
          filled: true,
          prefixIcon: SizedBox(
            width: widget.smallerSize * 0.1,
            child: Row(
              children: [
                Container(
                  height: widget.smallerSize * 0.15,
                  width: widget.smallerSize * 0.05,
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(widget.myBorderRadius),
                      topLeft: Radius.circular(widget.myBorderRadius),
                    ),
                  ),
                ),
              ],
            ),
          ),
          suffixIcon: widget.isPassword
              ? GestureDetector(
                  child: Icon(
                    showPassword == false
                        ? Icons.visibility_off
                        : Icons.visibility,
                    color: Colors.grey,
                    size: 25,
                  ),
                  onTap: () {
                    setState(() {
                      showPassword = !showPassword;
                    });
                  },
                )
              : const SizedBox(),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.myBorderRadius),
            borderSide: const BorderSide(
              width: 1,
              color: Color.fromARGB(90, 175, 165, 159),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.myBorderRadius),
            borderSide: const BorderSide(
              width: 1,
              color: Color.fromARGB(90, 175, 165, 159),
            ),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.myBorderRadius),
            borderSide: const BorderSide(
              width: 1,
              color: Colors.red,
            ),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.myBorderRadius),
            borderSide: const BorderSide(
              width: 1,
              color: Colors.red,
            ),
          ),
        ),
      ),
    );
  }
}
