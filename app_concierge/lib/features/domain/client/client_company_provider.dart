import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:flutter/material.dart';

class ClientCompanyProvider extends ChangeNotifier {
  late ClientCompany _client;

  ClientCompany get client => _client;

  void add(ClientCompany client) {
    _client = client;
  }
}
