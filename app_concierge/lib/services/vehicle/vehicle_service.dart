import 'package:app_concierge/features/data/domain/user_login_sqlite_service.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_entry.dart';
import 'package:app_concierge/features/domain/vehicle/vehicle_model.dart';
import 'package:dio/dio.dart';
import 'package:app_concierge/core/constants/url_constants.dart';
import 'package:app_concierge/core/constants/message_constants.dart';

class VehicleService {
  Future<List<VehicleEntry>> allPendingAuthorization() async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        kURL_LIST_VEHICLE_ENTRY,
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

  Future<List<VehicleEntry>> allAuthorized() async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        kURL_LIST_VEHICLE_EXIT,
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

  Future<Vehicle> vehicleId(int id) async {
    final dio = Dio();
    try {
      final token = await userStorange();

      final response = await dio.get(
        "$kURL_VEHICLE_ID$id",
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

  Future<String> userStorange() async {
    UserLoginSqliteService service = UserLoginSqliteService();
    var login = await service.userLogin();
    return login.token!;
  }
}
