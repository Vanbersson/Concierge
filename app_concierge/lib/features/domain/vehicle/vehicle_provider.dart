import 'dart:ffi';

import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:flutter/material.dart';

class VehicleProvider extends ChangeNotifier {
  List<Vehicle> _listVehicle = [];

  List<Vehicle> get items => _listVehicle;

  void add(Vehicle vehicle) {
    _listVehicle.add(vehicle);
    notifyListeners();
  }

  void removeAll() {
    _listVehicle.clear();
    notifyListeners();
  }

  void removeItem(int index) {
    _listVehicle.removeAt(index);
    notifyListeners();
  }
}
