class UserAttendant {
  int? _companyId;
  String? _roleDesc;
  int? _limitDiscount;
  int? _roleId;
  int? _resaleId;
  String? _name;
  String? _cellphone;
  String? _photo;
  int? _id;
  String? _email;
  String? _status;
  String? _roleFunc;

  UserAttendant(
      {int? companyId,
      String? roleDesc,
      int? limitDiscount,
      int? roleId,
      int? resaleId,
      String? name,
      String? cellphone,
      String? photo,
      int? id,
      String? email,
      String? status,
      String? roleFunc}) {
    if (companyId != null) {
      this._companyId = companyId;
    }
    if (roleDesc != null) {
      this._roleDesc = roleDesc;
    }
    if (limitDiscount != null) {
      this._limitDiscount = limitDiscount;
    }
    if (roleId != null) {
      this._roleId = roleId;
    }
    if (resaleId != null) {
      this._resaleId = resaleId;
    }
    if (name != null) {
      this._name = name;
    }
    if (cellphone != null) {
      this._cellphone = cellphone;
    }
    if (photo != null) {
      this._photo = photo;
    }
    if (id != null) {
      this._id = id;
    }
    if (email != null) {
      this._email = email;
    }
    if (status != null) {
      this._status = status;
    }
    if (roleFunc != null) {
      this._roleFunc = roleFunc;
    }
  }

  int? get companyId => _companyId;
  set companyId(int? companyId) => _companyId = companyId;
  String? get roleDesc => _roleDesc;
  set roleDesc(String? roleDesc) => _roleDesc = roleDesc;
  int? get limitDiscount => _limitDiscount;
  set limitDiscount(int? limitDiscount) => _limitDiscount = limitDiscount;
  int? get roleId => _roleId;
  set roleId(int? roleId) => _roleId = roleId;
  int? get resaleId => _resaleId;
  set resaleId(int? resaleId) => _resaleId = resaleId;
  String? get name => _name;
  set name(String? name) => _name = name;
  String? get cellphone => _cellphone;
  set cellphone(String? cellphone) => _cellphone = cellphone;
  String? get photo => _photo;
  set photo(String? photo) => _photo = photo;
  int? get id => _id;
  set id(int? id) => _id = id;
  String? get email => _email;
  set email(String? email) => _email = email;
  String? get status => _status;
  set status(String? status) => _status = status;
  String? get roleFunc => _roleFunc;
  set roleFunc(String? roleFunc) => _roleFunc = roleFunc;

  UserAttendant.fromJson(Map<String, dynamic> json) {
    _companyId = json['companyId'];
    _roleDesc = json['roleDesc'];
    _limitDiscount = json['limitDiscount'];
    _roleId = json['roleId'];
    _resaleId = json['resaleId'];
    _name = json['name'];
    _cellphone = json['cellphone'];
    _photo = json['photo'];
    _id = json['id'];
    _email = json['email'];
    _status = json['status'];
    _roleFunc = json['roleFunc'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyId'] = this._companyId;
    data['roleDesc'] = this._roleDesc;
    data['limitDiscount'] = this._limitDiscount;
    data['roleId'] = this._roleId;
    data['resaleId'] = this._resaleId;
    data['name'] = this._name;
    data['cellphone'] = this._cellphone;
    data['photo'] = this._photo;
    data['id'] = this._id;
    data['email'] = this._email;
    data['status'] = this._status;
    data['roleFunc'] = this._roleFunc;
    return data;
  }
}
