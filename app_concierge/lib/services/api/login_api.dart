import 'dart:convert';

import 'package:app_concierge/models/user.dart';
import 'package:dio/dio.dart';

class LoginApi {
  String urlApi = 'http://10.0.1.164:8080/login';

  Future<User> login(User user) async {
    var jsonData = jsonEncode(user);
    print(jsonData);

    try {
      Response response = await Dio()
          .post(urlApi, data: jsonData);

      if (response.statusCode == 200) {
        var json = jsonDecode(response.data);

        

        //return User.fromJson(json);
      }
    } on DioException catch (e) {
      if (e.response!.statusCode == 401) {
        return User();
      }
    }

    return User();
  }

  logout() {}
}
