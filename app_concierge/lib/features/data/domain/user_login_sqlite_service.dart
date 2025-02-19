import 'package:app_concierge/features/data/sqlite/database_sqlite.dart';
import 'package:app_concierge/features/domain/user/user_login.dart';
import 'package:sqflite/sqflite.dart';
import 'package:app_concierge/features/data/sqlite/constants_sqlite.dart';

import 'package:app_concierge/core/constants/message_constants.dart';

class UserLoginSqliteService {
  
  Future<int> save(UserLogin user) async {
    String sql = '''
      INSERT INTO $kTableUserLogin
      (companyId,resaleId,id,name,roleDesc,limitDiscount,cellphone,photo,token)
      VALUES
      (?,?,?,?,?,?,?,?,?)
      ''';

    try {
      final Database db = await DatabaseSqlite().getDatabase();
      int result = await db.rawInsert(sql, [
        user.companyId,
        user.resaleId,
        user.id,
        user.name,
        user.roleDesc,
        user.limitDiscount,
        user.cellphone,
        user.photo,
        user.token
      ]);

      return result;
    } catch (e) {
      return 0;
    }
  }

  Future<UserLogin> userLogin() async {
    var sql = "SELECT * FROM $kTableUserLogin";
    try {
      final Database db = await DatabaseSqlite().getDatabase();

      List<Map<String, dynamic>> list = await db.rawQuery(sql);
      if (list.isEmpty) {
        return UserLogin(token: kERRORUNAUTHORIZED);
      } else {
        return UserLogin.fromJson(list[0]);
      }
    } catch (e) {
      return UserLogin(token: kERRORUNAUTHORIZED);
    }
  }

  Future<bool> delete() async {
    try {
      final Database db = await DatabaseSqlite().getDatabase();

      int result = await db.delete(kTableUserLogin);
      if (result > 0) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
