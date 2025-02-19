class VehicleEntry {
  String? _modelDescription;
  String? _frota;
  String? _clientCompanyName;
  String? _vehicleNew;
  int? _days;
  String? _nameUserAttendant;
  String? _statusAuthExit;
  int? _id;
  String? _budgetStatus;
  String? _dateEntry;
  String? _placa;

  VehicleEntry(
      {String? modelDescription,
      String? frota,
      String? clientCompanyName,
      String? vehicleNew,
      int? days,
      String? nameUserAttendant,
      String? statusAuthExit,
      int? id,
      String? budgetStatus,
      String? dateEntry,
      String? placa}) {
    if (modelDescription != null) {
      this._modelDescription = modelDescription;
    }
    if (frota != null) {
      this._frota = frota;
    }
    if (clientCompanyName != null) {
      this._clientCompanyName = clientCompanyName;
    }
    if (vehicleNew != null) {
      this._vehicleNew = vehicleNew;
    }
    if (days != null) {
      this._days = days;
    }
    if (nameUserAttendant != null) {
      this._nameUserAttendant = nameUserAttendant;
    }
    if (statusAuthExit != null) {
      this._statusAuthExit = statusAuthExit;
    }
    if (id != null) {
      this._id = id;
    }
    if (budgetStatus != null) {
      this._budgetStatus = budgetStatus;
    }
    if (dateEntry != null) {
      this._dateEntry = dateEntry;
    }
    if (placa != null) {
      this._placa = placa;
    }
  }

  String? get modelDescription => _modelDescription;
  set modelDescription(String? modelDescription) =>
      _modelDescription = modelDescription;
  String? get frota => _frota;
  set frota(String? frota) => _frota = frota;
  String? get clientCompanyName => _clientCompanyName;
  set clientCompanyName(String? clientCompanyName) =>
      _clientCompanyName = clientCompanyName;
  String? get vehicleNew => _vehicleNew;
  set vehicleNew(String? vehicleNew) => _vehicleNew = vehicleNew;
  int? get days => _days;
  set days(int? days) => _days = days;
  String? get nameUserAttendant => _nameUserAttendant;
  set nameUserAttendant(String? nameUserAttendant) =>
      _nameUserAttendant = nameUserAttendant;
  String? get statusAuthExit => _statusAuthExit;
  set statusAuthExit(String? statusAuthExit) =>
      _statusAuthExit = statusAuthExit;
  int? get id => _id;
  set id(int? id) => _id = id;
  String? get budgetStatus => _budgetStatus;
  set budgetStatus(String? budgetStatus) => _budgetStatus = budgetStatus;
  String? get dateEntry => _dateEntry;
  set dateEntry(String? dateEntry) => _dateEntry = dateEntry;
  String? get placa => _placa;
  set placa(String? placa) => _placa = placa;

  VehicleEntry.fromJson(Map<String, dynamic> json) {
    _modelDescription = json['modelDescription'];
    _frota = json['frota'];
    _clientCompanyName = json['clientCompanyName'];
    _vehicleNew = json['vehicleNew'];
    _days = json['days'];
    _nameUserAttendant = json['nameUserAttendant'];
    _statusAuthExit = json['statusAuthExit'];
    _id = json['id'];
    _budgetStatus = json['budgetStatus'];
    _dateEntry = json['dateEntry'];
    _placa = json['placa'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['modelDescription'] = this._modelDescription;
    data['frota'] = this._frota;
    data['clientCompanyName'] = this._clientCompanyName;
    data['vehicleNew'] = this._vehicleNew;
    data['days'] = this._days;
    data['nameUserAttendant'] = this._nameUserAttendant;
    data['statusAuthExit'] = this._statusAuthExit;
    data['id'] = this._id;
    data['budgetStatus'] = this._budgetStatus;
    data['dateEntry'] = this._dateEntry;
    data['placa'] = this._placa;
    return data;
  }
}
