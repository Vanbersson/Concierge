import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:app_concierge/features/data/sqlite/constants_sqlite.dart';

class DatabaseSqlite {
  Future<Database> getDatabase() async {
    var databasesPath = await getDatabasesPath();
    var path = join(databasesPath, kDATABASENOME);

    return openDatabase(path, onCreate: _onCreate, version: kDATABASEVERSION);
  }

  void deleteDb() async {
    var databasesPath = await getDatabasesPath();
    var path = join(databasesPath, kDATABASENOME);
    deleteDatabase(path);
  }

  _onCreate(db, version) async {
    await db.execute(kCreateTableUserLogin);
  }
}
 