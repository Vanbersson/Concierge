class ClientCompany {
  String? _zipCode;
  String? _addressComplement;
  String? _address;
  String? _city;
  String? _emailHome;
  String? _emailWork;
  String? _cnpj;
  String? _dddPhone;
  String? _fantasia;
  String? _rg;
  String? _phone;
  String? _name;
  String? _cpf;
  String? _addressNumber;
  String? _dddCellphone;
  String? _cellphone;
  int? _id;
  String? _clifor;
  String? _state;
  String? _neighborhood;
  String? _fisjur;
  String? _status;

  ClientCompany(
      {String? zipCode,
      String? addressComplement,
      String? address,
      String? city,
      String? emailHome,
      String? emailWork,
      String? cnpj,
      String? dddPhone,
      String? fantasia,
      String? rg,
      String? phone,
      String? name,
      String? cpf,
      String? addressNumber,
      String? dddCellphone,
      String? cellphone,
      int? id,
      String? clifor,
      String? state,
      String? neighborhood,
      String? fisjur,
      String? status}) {
    if (zipCode != null) {
      this._zipCode = zipCode;
    }
    if (addressComplement != null) {
      this._addressComplement = addressComplement;
    }
    if (address != null) {
      this._address = address;
    }
    if (city != null) {
      this._city = city;
    }
    if (emailHome != null) {
      this._emailHome = emailHome;
    }
    if (emailWork != null) {
      this._emailWork = emailWork;
    }
    if (cnpj != null) {
      this._cnpj = cnpj;
    }
    if (dddPhone != null) {
      this._dddPhone = dddPhone;
    }
    if (fantasia != null) {
      this._fantasia = fantasia;
    }
    if (rg != null) {
      this._rg = rg;
    }
    if (phone != null) {
      this._phone = phone;
    }
    if (name != null) {
      this._name = name;
    }
    if (cpf != null) {
      this._cpf = cpf;
    }
    if (addressNumber != null) {
      this._addressNumber = addressNumber;
    }
    if (dddCellphone != null) {
      this._dddCellphone = dddCellphone;
    }
    if (cellphone != null) {
      this._cellphone = cellphone;
    }
    if (id != null) {
      this._id = id;
    }
    if (clifor != null) {
      this._clifor = clifor;
    }
    if (state != null) {
      this._state = state;
    }
    if (neighborhood != null) {
      this._neighborhood = neighborhood;
    }
    if (fisjur != null) {
      this._fisjur = fisjur;
    }
    if (status != null) {
      this._status = status;
    }
  }

  String? get zipCode => _zipCode;
  set zipCode(String? zipCode) => _zipCode = zipCode;
  String? get addressComplement => _addressComplement;
  set addressComplement(String? addressComplement) =>
      _addressComplement = addressComplement;
  String? get address => _address;
  set address(String? address) => _address = address;
  String? get city => _city;
  set city(String? city) => _city = city;
  String? get emailHome => _emailHome;
  set emailHome(String? emailHome) => _emailHome = emailHome;
  String? get emailWork => _emailWork;
  set emailWork(String? emailWork) => _emailWork = emailWork;
  String? get cnpj => _cnpj;
  set cnpj(String? cnpj) => _cnpj = cnpj;
  String? get dddPhone => _dddPhone;
  set dddPhone(String? dddPhone) => _dddPhone = dddPhone;
  String? get fantasia => _fantasia;
  set fantasia(String? fantasia) => _fantasia = fantasia;
  String? get rg => _rg;
  set rg(String? rg) => _rg = rg;
  String? get phone => _phone;
  set phone(String? phone) => _phone = phone;
  String? get name => _name;
  set name(String? name) => _name = name;
  String? get cpf => _cpf;
  set cpf(String? cpf) => _cpf = cpf;
  String? get addressNumber => _addressNumber;
  set addressNumber(String? addressNumber) => _addressNumber = addressNumber;
  String? get dddCellphone => _dddCellphone;
  set dddCellphone(String? dddCellphone) => _dddCellphone = dddCellphone;
  String? get cellphone => _cellphone;
  set cellphone(String? cellphone) => _cellphone = cellphone;
  int? get id => _id;
  set id(int? id) => _id = id;
  String? get clifor => _clifor;
  set clifor(String? clifor) => _clifor = clifor;
  String? get state => _state;
  set state(String? state) => _state = state;
  String? get neighborhood => _neighborhood;
  set neighborhood(String? neighborhood) => _neighborhood = neighborhood;
  String? get fisjur => _fisjur;
  set fisjur(String? fisjur) => _fisjur = fisjur;
  String? get status => _status;
  set status(String? status) => _status = status;

  ClientCompany.fromJson(Map<String, dynamic> json) {
    _zipCode = json['zipCode'];
    _addressComplement = json['addressComplement'];
    _address = json['address'];
    _city = json['city'];
    _emailHome = json['emailHome'];
    _emailWork = json['emailWork'];
    _cnpj = json['cnpj'];
    _dddPhone = json['dddPhone'];
    _fantasia = json['fantasia'];
    _rg = json['rg'];
    _phone = json['phone'];
    _name = json['name'];
    _cpf = json['cpf'];
    _addressNumber = json['addressNumber'];
    _dddCellphone = json['dddCellphone'];
    _cellphone = json['cellphone'];
    _id = json['id'];
    _clifor = json['clifor'];
    _state = json['state'];
    _neighborhood = json['neighborhood'];
    _fisjur = json['fisjur'];
    _status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['zipCode'] = this._zipCode;
    data['addressComplement'] = this._addressComplement;
    data['address'] = this._address;
    data['city'] = this._city;
    data['emailHome'] = this._emailHome;
    data['emailWork'] = this._emailWork;
    data['cnpj'] = this._cnpj;
    data['dddPhone'] = this._dddPhone;
    data['fantasia'] = this._fantasia;
    data['rg'] = this._rg;
    data['phone'] = this._phone;
    data['name'] = this._name;
    data['cpf'] = this._cpf;
    data['addressNumber'] = this._addressNumber;
    data['dddCellphone'] = this._dddCellphone;
    data['cellphone'] = this._cellphone;
    data['id'] = this._id;
    data['clifor'] = this._clifor;
    data['state'] = this._state;
    data['neighborhood'] = this._neighborhood;
    data['fisjur'] = this._fisjur;
    data['status'] = this._status;
    return data;
  }
}
