class UserLogin {
  int? _companyId;
  int? _resaleId;
  int? _id;
  String? _name;
  String? _roleDesc;
  int? _limitDiscount;
  String? _cellphone;
  String? _photo;
  String? _token;

  UserLogin(
      {int? companyId,
      String? roleDesc,
      int? limitDiscount,
      int? resaleId,
      String? name,
      String? cellphone,
      String? photo,
      int? id,
      String? token}) {
    if (companyId != null) {
      this._companyId = companyId;
    }
    if (roleDesc != null) {
      this._roleDesc = roleDesc;
    }
    if (limitDiscount != null) {
      this._limitDiscount = limitDiscount;
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
    if (token != null) {
      this._token = token;
    }
  }

  int? get companyId => _companyId;
  set companyId(int? companyId) => _companyId = companyId;
  String? get roleDesc => _roleDesc;
  set roleDesc(String? roleDesc) => _roleDesc = roleDesc;
  int? get limitDiscount => _limitDiscount;
  set limitDiscount(int? limitDiscount) => _limitDiscount = limitDiscount;
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
  String? get token => _token;
  set token(String? token) => _token = token;

  UserLogin.fromJson(Map<String, dynamic> json) {
    _companyId = json['companyId'];
    _resaleId = json['resaleId'];
    _id = json['id'];
    _roleDesc = json['roleDesc'];
    _name = json['name'];
    _limitDiscount = json['limitDiscount'];
    _cellphone =  json['cellphone'];
    _photo = json['photo'];
    _token = json['token']; 
  }

 /*  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyId'] = this._companyId;
    data['roleDesc'] = this._roleDesc;
    data['limitDiscount'] = this._limitDiscount;
    data['resaleId'] = this._resaleId;
    data['name'] = this._name;
    data['cellphone'] = this._cellphone;
    data['photo'] = this._photo;
    data['id'] = this._id;
    data['token'] = this._token;
    return data;
  } */
}
