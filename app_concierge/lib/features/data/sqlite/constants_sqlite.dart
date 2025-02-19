const String kDATABASENOME = "autopoint.db";
const int kDATABASEVERSION = 1;




const String kTableUserLogin = "userlogin";
const String kCreateTableUserLogin = '''
CREATE TABLE $kTableUserLogin(
companyId INTEGER,
resaleId INTEGER,
id INTEGER PRIMARY KEY,
name TEXT,
roleDesc TEXT,
limitDiscount INTEGER,
cellphone TEXT,
photo BLOB,
token TEXT
)
''';
