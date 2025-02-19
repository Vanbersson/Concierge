import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

// ignore: must_be_immutable
class Mytextfield extends StatelessWidget {
  final myKey;
  final myController;
  final String myLabelText;
  final TextInputType myKeyboardType;
  final TextInputAction myTextInputAction;
  Color? myTextColor;
  MaskTextInputFormatter? maskText;
  int? myMaxLength;
  int? myMaxLines;
  bool? myEnabled;
  TextCapitalization? myTextCapitalization;

  Mytextfield({
    super.key,
    required this.myKey,
    required this.myController,
    required this.myLabelText,
    required this.myKeyboardType,
    required this.myTextInputAction,
    this.myTextColor,
    this.maskText,
    this.myMaxLength,
    this.myMaxLines,
    this.myEnabled,
    this.myTextCapitalization,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      key: myKey,
      validator: (text) {
        if (text == null || text.trim().isEmpty) {
          return "Inválido!";
        }
        return null;
      },
      onTapOutside: (event) => FocusScope.of(context).unfocus(),
      controller: myController,
      keyboardType: myKeyboardType,
      textInputAction: myTextInputAction,
      inputFormatters: maskText != null ? [maskText!] : [],
      maxLength: myMaxLength ?? 255,
      maxLines: myMaxLines ?? 1,
      enabled: myEnabled ?? true,
      textCapitalization: myTextCapitalization ?? TextCapitalization.words,
      style: TextStyle(
        color: myTextColor ?? Colors.blue,
        fontWeight: FontWeight.bold,
        fontSize: 16,
      ),
      decoration: InputDecoration(
        counterText: "",
        fillColor: Colors.grey.shade200,
        filled: true,
        labelText: myLabelText,
        labelStyle: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          color: Colors.grey.shade700,
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey.shade100),
          borderRadius: const BorderRadius.all(
            Radius.circular(10),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey.shade400),
          borderRadius: const BorderRadius.all(
            Radius.circular(10),
          ),
        ),
      ),
    );
  }
}
