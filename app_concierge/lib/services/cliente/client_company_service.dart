import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:dio/dio.dart';
import 'package:app_concierge/core/constants/url_constants.dart';

class ClientCompanyService {
  Future<List<ClientCompany>> filterCode(String code) async {
    final dio = Dio();

    try {
      final response = await dio.get("$kURL_CLIENT_FILTER/code/$code");

      List<ClientCompany> list = [];
      for (var client in response.data) {
        list.add(ClientCompany.fromJson(client));
      }
      return list;
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return List.empty();
  }

  Future<List<ClientCompany>> filterJFantasia(String fantasia) async {
    final dio = Dio();

    try {
      final response =
          await dio.get("$kURL_CLIENT_FILTER/j/fantasia/$fantasia");

      List<ClientCompany> list = [];
      for (var client in response.data) {
        list.add(ClientCompany.fromJson(client));
      }

      return list;
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return List.empty();
  }

  Future<List<ClientCompany>> filterFFantasia(String fantasia) async {
    final dio = Dio();

    try {
      final response =
          await dio.get("$kURL_CLIENT_FILTER/f/fantasia/$fantasia");

      List<ClientCompany> list = [];
      for (var client in response.data) {
        list.add(ClientCompany.fromJson(client));
      }

      return list;
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return List.empty();
  }

  Future<List<ClientCompany>> filterJName(String name) async {
    final dio = Dio();

    try {
      final response = await dio.get("$kURL_CLIENT_FILTER/j/name/$name");

      List<ClientCompany> list = [];
      for (var client in response.data) {
        list.add(ClientCompany.fromJson(client));
      }

      return list;
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return List.empty();
  }

  Future<List<ClientCompany>> filterFName(String name) async {
    final dio = Dio();

    try {
      final response = await dio.get("$kURL_CLIENT_FILTER/f/name/$name");

      List<ClientCompany> list = [];
      for (var client in response.data) {
        list.add(ClientCompany.fromJson(client));
      }

      return list;
    } on DioException catch (e) {
      print('Erro: $e');
    }
    return List.empty();
  }

  Future<String> save(ClientCompany client) async {
    final dio = Dio();

    try {
      final token = await userStorange();

      final response = await dio.post(
        kURL_CLIENTCOMPANY_SAVE,
        data: client.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );
      if (response.statusCode == 201) {
        return "Success.";
      }
      return "Error.";
    } on DioException catch (e) {
      return "Error.";
    }
  }

  Future<String> userStorange() async {
    UserLoginSqliteService service = UserLoginSqliteService();
    var login = await service.userLogin();
    return login.token!;
  }
}
