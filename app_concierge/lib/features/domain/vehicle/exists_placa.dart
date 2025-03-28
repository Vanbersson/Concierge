class ExistsPlaca {
  int? _companyId;
  int? _resaleId;
  String? _placa;

  ExistsPlaca({int? companyId, int? resaleId, String? placa}) {
    if (companyId != null) {
      this._companyId = companyId;
    }
    if (resaleId != null) {
      this._resaleId = resaleId;
    }
    if (placa != null) {
      this._placa = placa;
    }
  }

  int? get companyId => _companyId;
  set companyId(int? companyId) => _companyId = companyId;
  int? get resaleId => _resaleId;
  set resaleId(int? resaleId) => _resaleId = resaleId;
  String? get placa => _placa;
  set placa(String? placa) => _placa = placa;

  ExistsPlaca.fromJson(Map<String, dynamic> json) {
    _companyId = json['companyId'];
    _resaleId = json['resaleId'];
    _placa = json['placa'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyId'] = this._companyId;
    data['resaleId'] = this._resaleId;
    data['placa'] = this._placa;
    return data;
  }
}
