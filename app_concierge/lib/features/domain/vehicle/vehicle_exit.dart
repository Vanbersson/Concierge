class VehicleExit {
  int? _companyId;
  int? _resaleId;
  int? _vehicleId;
  int? _userId;
  String? _userName;
  String? _dateExit;

  VehicleExit(
      {int? companyId,
      int? resaleId,
      int? vehicleId,
      int? userId,
      String? userName,
      String? dateExit}) {
    if (companyId != null) {
      this._companyId = companyId;
    }
    if (resaleId != null) {
      this._resaleId = resaleId;
    }
    if (vehicleId != null) {
      this._vehicleId = vehicleId;
    }
    if (userId != null) {
      this._userId = userId;
    }
    if (userName != null) {
      this._userName = userName;
    }
    if (dateExit != null) {
      this._dateExit = dateExit;
    }
  }

  int? get companyId => _companyId;
  set companyId(int? companyId) => _companyId = companyId;
  int? get resaleId => _resaleId;
  set resaleId(int? resaleId) => _resaleId = resaleId;
  int? get vehicleId => _vehicleId;
  set vehicleId(int? vehicleId) => _vehicleId = vehicleId;
  int? get userId => _userId;
  set userId(int? userId) => _userId = userId;
  String? get userName => _userName;
  set userName(String? userName) => _userName = userName;
  String? get dateExit => _dateExit;
  set dateExit(String? dateExit) => _dateExit = dateExit;

  VehicleExit.fromJson(Map<String, dynamic> json) {
    _companyId = json['companyId'];
    _resaleId = json['resaleId'];
    _vehicleId = json['vehicleId'];
    _userId = json['userId'];
    _userName = json['userName'];
    _dateExit = json['dateExit'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyId'] = this._companyId;
    data['resaleId'] = this._resaleId;
    data['vehicleId'] = this._vehicleId;
    data['userId'] = this._userId;
    data['userName'] = this._userName;
    data['dateExit'] = this._dateExit;
    return data;
  }
}
