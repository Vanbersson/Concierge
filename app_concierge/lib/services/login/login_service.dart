import 'package:dio/dio.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:app_concierge/core/constants/url_constants.dart';
import 'package:app_concierge/core/constants/message_constants.dart';

class LoginService {
  Future<UserLogin> login(String email, String password) async {
    final dio = Dio();

    try {
      final response = await dio.post(
        kURLLOGIN,
        data: {'email': email, 'password': password},
      );
      if (response.statusCode == 200) {
        return UserLogin.fromJson(response.data);
      }
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return UserLogin(token: kERRORUNAUTHORIZED);
  }
}
