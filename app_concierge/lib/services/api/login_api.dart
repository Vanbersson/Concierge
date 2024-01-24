import 'dart:convert';

import 'package:app_concierge/models/user.dart';
import 'package:dio/dio.dart';

class LoginApi {
  String urlApi = '';

  Future<User> login(User user) async {
    FormData data =
        FormData.fromMap({'login': user.login, 'password': user.password});

    try {
      Response response = await Dio().post(urlApi, data: data);

      if (response.statusCode == 200) {
        var json = jsonDecode(response.data);

        return User.fromJson(json);
      }
    } on DioException catch (e) {
      if (e.response!.statusCode == 401) {
        return User(status: false);
      }
    }

    return User(status: false);
  }

  logout() {}
}
