import 'package:flutter/material.dart';

class Mytext extends StatelessWidget {
  String showLabel;
  double myWidth;
  double? myHight;
  String showText;

  Mytext({
    super.key,
    required this.showLabel,
    required this.showText,
    required this.myWidth,
    this.myHight,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          showLabel,
          style: const TextStyle(
              color: Colors.black54, fontSize: 16, fontWeight: FontWeight.w300),
        ),
        Container(
          width: myWidth,
          height: myHight ?? 50.0,
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(left: 8.0),
              child: Text(
                showText,
                style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 18,
                    fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
