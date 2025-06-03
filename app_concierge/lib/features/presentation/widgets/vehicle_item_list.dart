import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class VehicleItemList extends StatefulWidget {
  double myWidth;

  String myPlaca;
  String myStatusAuth;
  String myVehicleNew;
  String myClientName;
  String myDateEntry;
  String myDodelDesc;

  VehicleItemList(
      {super.key,
      required this.myWidth,
      required this.myPlaca,
      required this.myStatusAuth,
      required this.myVehicleNew,
      required this.myClientName,
      required this.myDateEntry,
      required this.myDodelDesc});

  @override
  State<VehicleItemList> createState() => _VehicleItemListState();
}

class _VehicleItemListState extends State<VehicleItemList> {
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      height: 60,
      width: widget.myWidth * 0.76,
      duration: const Duration(milliseconds: 500),
      decoration: BoxDecoration(
          color: widget.myStatusAuth == "Authorized"
              ? Colors.green.shade300
              : Colors.grey.shade300,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(10.0),
            bottomLeft: Radius.circular(10.0),
          )),
      child: Row(
        children: [
          SizedBox(
            width: widget.myWidth * 0.4,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  widget.myVehicleNew != "yes"
                      ? widget.myPlaca.toUpperCase()
                      : "",
                  style: const TextStyle(
                      color: Colors.black87, fontWeight: FontWeight.bold),
                ),
                Text(
                  widget.myClientName != ""
                      ? abreviaName(widget.myClientName)
                      : "",
                  style: TextStyle(
                      color: Colors.black54,
                      fontSize: widget.myWidth * 0.03,
                      fontWeight: FontWeight.w400),
                ),
              ],
            ),
          ),
          const SizedBox(
            width: 2,
          ),
          SizedBox(
            width: widget.myWidth * 0.3,
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    formtDate(widget.myDateEntry),
                    style: TextStyle(
                        color: Colors.black54,
                        fontSize: widget.myWidth * 0.03,
                        fontWeight: FontWeight.w400),
                  ),
                  Text(
                    widget.myDodelDesc,
                    style: TextStyle(
                        color: Colors.black54,
                        fontSize: widget.myWidth * 0.03,
                        fontWeight: FontWeight.w400),
                  ),
                ]),
          ),
        ],
      ),
    );
  }

  String formtDate(String date) {
    if (date == "") return "";

    DateTime dateTime = DateTime.parse(date).toLocal();
    return DateFormat("dd/MM/yyyy HH:mm").format(dateTime);
  }

  abreviaName(String name) {
    if (name.length <= 17) {
      return name;
    } else {
      return name.substring(0, 17);
    }
  }
}
