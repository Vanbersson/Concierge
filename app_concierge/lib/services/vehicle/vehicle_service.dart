import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/vehicle/exists_placa.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_entry.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_exit.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:dio/dio.dart';
import 'package:app_concierge/core/constants/url_constants.dart';

class VehicleService {
  Future<List<VehicleEntry>> allPendingAuthorization(int companyId, int resaleId) async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        "$kURL_BASE/vehicle/entry/$companyId/$resaleId/allPendingAuthorization",
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );

      List<VehicleEntry> listVehicle = [];
      for (var element in response.data) {
        listVehicle.add(VehicleEntry.fromJson(element));
      }
      return listVehicle;
    } on DioException catch (e) {
      return List.empty();
    }
  }

  Future<List<VehicleEntry>> allAuthorized(int companyId, int resaleId) async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        "$kURL_BASE/vehicle/entry/$companyId/$resaleId/allAuthorized",
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );

      List<VehicleEntry> listVehicle = [];
      for (var element in response.data) {
        listVehicle.add(VehicleEntry.fromJson(element));
      }
      return listVehicle;
    } on DioException catch (e) {
      return List.empty();
    }
  }

  Future<List<VehicleModel>> vehicleModels() async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        kURL_LIST_MODEL_VEHICLE,
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );

      List<VehicleModel> models = [];
      for (var element in response.data) {
        models.add(VehicleModel.fromJson(element));
      }

      return models;
    } on DioException catch (e) {
      return List.empty();
    }
  }

  Future<Vehicle> vehicleId(int companyId, int resaleId, int id) async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        "$kURL_BASE/vehicle/entry/$companyId/$resaleId/filter/id/$id",
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );

      return Vehicle.fromJson(response.data);
    } on DioException catch (e) {
      return Vehicle();
    }
  }

  Future<String> save(Vehicle vehicle) async {
    final dio = Dio();

    try {
      final token = await userStorange();

      final response = await dio.post(
        kURL_VEHICLE_SAVE,
        data: vehicle.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );
      if (response.statusCode == 201) {
        vehicle.id = response.data['id'];
        return "Success.";
      }
      return "Error.";
    } on DioException catch (e) {
      return "Error.";
    }
  }

  Future<String> exit(VehicleExit vehicle) async {
    final dio = Dio();

    try {
      final token = await userStorange();

      final response = await dio.post(
        kURL_VEHICLE_SAVE_EXIT,
        data: vehicle.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );
      if (response.statusCode == 200) {
        return "Success.";
      }
      return "Error.";
    } on DioException catch (e) {
      return "Error.";
    }
  }

  Future<String> existsPlaca(ExistsPlaca vehicle) async {
    final dio = Dio();

    try {
      final token = await userStorange();

      final response = await dio.post(
        kURL_EXISTS_PLACA,
        data: vehicle.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        }, responseType: ResponseType.json),
      );
      if (response.statusCode == 200) {
        return response.data['message'];
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
