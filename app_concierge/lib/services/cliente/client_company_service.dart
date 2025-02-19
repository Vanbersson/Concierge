import 'package:app_concierge/features/domain/client/client_company.dart';
import 'package:dio/dio.dart';
import 'package:app_concierge/core/constants/url_constants.dart';

class ClientCompanyService {
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
}
