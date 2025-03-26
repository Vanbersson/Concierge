import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:flutter/material.dart';

class VehicleModelProvider extends ChangeNotifier{

  List<VehicleModel> _models = [];

  List<VehicleModel> get items => _models;

  void add(List<VehicleModel> models) {
    _models = models;
    notifyListeners();
  }
}