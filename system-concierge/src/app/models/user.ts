import { Role } from "./role";

export class User {

    private _resaleId: number = 0;

    private _id: number = 0;

    private _status: string = "";

    private _name: string = "";

    private _password: string = "";

    private _email: string = "";

    private _role: Role = new Role();


    constructor() { }

    public get resaleId(): number {
        return this._resaleId;
    }
    public set resaleId(value: number) {
        this._resaleId = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get status(): string {
        return this._status;
    }
    public set status(value: string) {
        this._status = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get role(): Role {
        return this._role;
    }
    public set role(value: Role) {
        this._role = value;
    }





}