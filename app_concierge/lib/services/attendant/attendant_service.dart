import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/user/user_attendant.dart';
import 'package:dio/dio.dart';
import 'package:app_concierge/core/constants/url_constants.dart';

class AttendantService {



  Future<List<UserAttendant>> attendants() async {
    final dio = Dio();
    try {
      final token = await _userStorange();

      final response = await dio.get(
        kURL_ATTENDANT,
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );

      List<UserAttendant> attendants = [];
      for (var element in response.data) {
        attendants.add(UserAttendant.fromJson(element));
      }

      return attendants;
    } on DioException catch (e) {
      return List.empty();
    }
  }

  Future<String> _userStorange() async {
    UserLoginSqliteService service = UserLoginSqliteService();
    var login = await service.userLogin();
    return login.token!;
  }
}
