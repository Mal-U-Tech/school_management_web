export class Classname {
  private _id?: string;
  private name = '';

  set setId(value: string) {
    this._id = value;
  }

  get getId() {
    return this._id;
  }

  set setName(value: string) {
    this.name = value;
  }

  get getName() {
    return this.name;
  }
}
