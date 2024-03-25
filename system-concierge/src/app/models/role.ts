export class Role {
    private _resaleId?: number | undefined;

    private _id?: number | undefined;

    private _status?: string | undefined;

    private _description?: string | undefined;

    private _role?: string | undefined;


    constructor() { }

    public get resaleId(): number | undefined {
        return this._resaleId;
    }
    public set resaleId(value: number | undefined) {
        this._resaleId = value;
    }
    public get id(): number | undefined {
        return this._id;
    }
    public set id(value: number | undefined) {
        this._id = value;
    }
    public get status(): string | undefined {
        return this._status;
    }
    public set status(value: string | undefined) {
        this._status = value;
    }
    public get description(): string | undefined {
        return this._description;
    }
    public set description(value: string | undefined) {
        this._description = value;
    }
    public get role(): string | undefined {
        return this._role;
    }
    public set role(value: string | undefined) {
        this._role = value;
    }
}