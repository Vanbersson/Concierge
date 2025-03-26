import 'package:app_concierge/features/domain/user/user_attendant.dart';
import 'package:flutter/material.dart';

class UserAttendantProvider extends ChangeNotifier {
  List<UserAttendant> _attendants = [];

  List<UserAttendant> get items => _attendants;

  void add(List<UserAttendant> attendant) {
    _attendants = attendant;
    notifyListeners();
  }
}
