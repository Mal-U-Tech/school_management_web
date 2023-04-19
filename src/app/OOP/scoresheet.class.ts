export class Scoresheet {
  public _id: string | null;
  private name: string | null;
  private year: string | null;
  classes: any[] | null; // to add Class Steams class
  subjects: any[] | null;

  constructor(
    _id: string | null,
    name: string | null,
    year: string | null,
    classes: any[] | null,
    subjects: any[] | null
  ) {
    this._id = _id;
    this.name = name;
    this.year = year;
    this.classes = classes;
    this.subjects = subjects;
  }

  // setters
  set setName(value: string) {
    this.name = value;
  }

  set setYear(value: string) {
    this.year = value;
  }

  set setClasses(value: any[]) {
    this.classes = value;
  }

  set setSubjects(value: any[]) {
    this.subjects = value;
  }

  // getters
  get getId() {
    return this._id;
  }

  get getName() {
    return this.name;
  }

  get getYear() {
    return this.year;
  }

  get getClasses() {
    return this.classes;
  }

  get getSubjects() {
    return this.subjects;
  }

  // function to stringify scoresheet data for the database
  stringify() {
    return {
      _id: this._id,
      name: this.name,
      year: this.year,
      classes: this.classes,
      subjects: this.subjects,
    };
  }

  // function to parse json data from the server to create scoresheet class
  parse(serverData: any): Scoresheet {
    return new Scoresheet(
      serverData._id,
      serverData.name,
      serverData.year,
      serverData.classes,
      serverData.subjects
    );
  }
}
