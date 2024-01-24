import 'package:app_concierge/models/role_user.dart';

class User {
  int? _id;
  bool? _status;
  String? _name;
  String? _login;
  String? _password;
  String? _email;
  String? _cellPhone;
  RoleUser? _roleUser;

  User(
      {int? id,
      bool? status,
      String? name,
      String? login,
      String? password,
      String? email,
      String? cellPhone,
      RoleUser? roleUser}) {
    if (id != null) {
      this._id = id;
    }
    if (status != null) {
      this._status = status;
    }
    if (name != null) {
      this._name = name;
    }
    if (login != null) {
      this._login = login;
    }
    if (password != null) {
      this._password = password;
    }
    if (email != null) {
      this._email = email;
    }
    if (cellPhone != null) {
      this._cellPhone = cellPhone;
    }
    if (roleUser != null) {
      this._roleUser = roleUser;
    }
  }

  int? get id => _id;
  set id(int? id) => _id = id;
  bool? get status => _status;
  set status(bool? status) => _status = status;
  String? get name => _name;
  set name(String? name) => _name = name;
  String? get login => _login;
  set login(String? login) => _login = login;
  String? get password => _password;
  set password(String? password) => _password = password;
  String? get email => _email;
  set email(String? email) => _email = email;
  String? get cellPhone => _cellPhone;
  set cellPhone(String? cellPhone) => _cellPhone = cellPhone;
  RoleUser? get roleUser => _roleUser;
  set roleUser(RoleUser? roleUser) => _roleUser = roleUser;

  User.fromJson(Map<String, dynamic> json) {
    _id = json['id'];
    _status = json['status'];
    _name = json['name'];
    _login = json['login'];
    _password = json['password'];
    _email = json['email'];
    _cellPhone = json['cellPhone'];
    _roleUser = json['roleUser'] != null
        ? new RoleUser.fromJson(json['roleUser'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this._id;
    data['status'] = this._status;
    data['name'] = this._name;
    data['login'] = this._login;
    data['password'] = this._password;
    data['email'] = this._email;
    data['cellPhone'] = this._cellPhone;
    if (this._roleUser != null) {
      data['roleUser'] = this._roleUser!.toJson();
    }
    return data;
  }
}


