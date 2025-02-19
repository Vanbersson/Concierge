class UserDriver {
  String? _name;
  String? _cpf;
  String? _rg;
  String? _photo;
  String? _doc1;
  String? _doc2;

  UserDriver(
      {String? name,
      String? cpf,
      String? rg,
      String? photo,
      String? doc1,
      String? doc2}) {
    if (name != null) {
      this._name = name;
    }
    if (cpf != null) {
      this._cpf = cpf;
    }
    if (rg != null) {
      this._rg = rg;
    }
    if (photo != null) {
      this._photo = photo;
    }
    if (doc1 != null) {
      this._doc1 = doc1;
    }
    if (doc2 != null) {
      this._doc2 = doc2;
    }
  }

  String? get name => _name;
  set name(String? name) => _name = name;
  String? get cpf => _cpf;
  set cpf(String? cpf) => _cpf = cpf;
  String? get rg => _rg;
  set rg(String? rg) => _rg = rg;
  String? get photo => _photo;
  set photo(String? photo) => _photo = photo;
  String? get doc1 => _doc1;
  set doc1(String? doc1) => _doc1 = doc1;
  String? get doc2 => _doc2;
  set doc2(String? doc2) => _doc2 = doc2;

  UserDriver.fromJson(Map<String, dynamic> json) {
    _name = json['name'];
    _cpf = json['cpf'];
    _rg = json['rg'];
    _photo = json['photo'];
    _doc1 = json['doc1'];
    _doc2 = json['doc2'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this._name;
    data['cpf'] = this._cpf;
    data['rg'] = this._rg;
    data['photo'] = this._photo;
    data['doc1'] = this._doc1;
    data['doc2'] = this._doc2;
    return data;
  }
}
