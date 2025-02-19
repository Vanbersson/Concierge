class VehicleModel {
  int? _companyId;
  int? _resaleId;
  int? _id;
  String? _status;
  String? _description;
  String? _photo;

  VehicleModel(
      {int? companyId,
      int? resaleId,
      int? id,
      String? status,
      String? description,
      String? photo}) {
    if (companyId != null) {
      this._companyId = companyId;
    }
    if (resaleId != null) {
      this._resaleId = resaleId;
    }
    if (id != null) {
      this._id = id;
    }
    if (status != null) {
      this._status = status;
    }
    if (description != null) {
      this._description = description;
    }
    if (photo != null) {
      this._photo = photo;
    }
  }

  int? get companyId => _companyId;
  set companyId(int? companyId) => _companyId = companyId;
  int? get resaleId => _resaleId;
  set resaleId(int? resaleId) => _resaleId = resaleId;
  int? get id => _id;
  set id(int? id) => _id = id;
  String? get status => _status;
  set status(String? status) => _status = status;
  String? get description => _description;
  set description(String? description) => _description = description;
  String? get photo => _photo;
  set photo(String? photo) => _photo = photo;

  VehicleModel.fromJson(Map<String, dynamic> json) {
    _companyId = json['companyId'];
    _resaleId = json['resaleId'];
    _id = json['id'];
    _status = json['status'];
    _description = json['description'];
    _photo = json['photo'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyId'] = this._companyId;
    data['resaleId'] = this._resaleId;
    data['id'] = this._id;
    data['status'] = this._status;
    data['description'] = this._description;
    data['photo'] = this._photo;
    return data;
  }
}
