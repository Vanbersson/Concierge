// ignore_for_file: unnecessary_getters_setters

class RoleUser {
  int? _id;
  bool? _description;

  RoleUser({int? id, bool? description}) {
    if (id != null) {
      this._id = id;
    }
    if (description != null) {
      this._description = description;
    }
  }

  int? get id => _id;
  set id(int? id) => _id = id;
  bool? get description => _description;
  set description(bool? description) => _description = description;

  RoleUser.fromJson(Map<String, dynamic> json) {
    _id = json['id'];
    _description = json['description'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this._id;
    data['description'] = this._description;
    return data;
  }
}