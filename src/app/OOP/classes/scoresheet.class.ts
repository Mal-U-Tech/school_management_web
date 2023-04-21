import { ClassnameApiService } from 'src/app/shared/classname/classname-api.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { ScoresheetParameters } from './parameters/scoresheet.parameters';

export class Scoresheet {
  public _id?: string | null;
  private name?: string | null;
  private year?: string | null;
  classes?: any[] | null; // to add Class Steams class
  subjects?: any[] | null;
  api: ScoresheetService;

  constructor({
    _id = '',
    name = '',
    year = '',
    classes = [],
    subjects = [],
    api,
  }: ScoresheetParameters) {
    this._id = _id;
    this.name = name;
    this.year = year;
    this.classes = classes;
    this.subjects = subjects;
    this.api = api;
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

  set setAPI(value: any) {
    this.api = value;
  }

  // getters
  get getId(): string {
    return this._id!;
  }

  get getName(): string {
    return this.name!;
  }

  get getYear(): string {
    return this.year!;
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
    return new Scoresheet({
      _id: serverData._id,
      name: serverData.name,
      year: serverData.year,
      classes: serverData.classes,
      subjects: serverData.subjects,
      api: this.api,
    });
  }

  // functio to create new scoresheet in the server
  saveScoresheet() {
    if (this.isAPI()) {
      this.api?.postScoresheet(this.stringify()).subscribe({
        next: (data: any) => {
          console.log(data);
          this.api?.successToast(
            `Successfully created ${this.name} scoresheet.`
          );
        },
        error: (error) => {
          this.api?.errorToast(`Error occurred : ${error.toString()}`);
        },
      });
    }
  }

  // check if API is null
  isAPI() {
    if (this.api === null) {
      return false;
    } else {
      return true;
    }
  }

  // function to get scoresheet by id
  getScoresheet() {
    this.api?.getOneScoresheet(this._id!).subscribe({
      next: (data: any) => {
        console.log(data);
        this._id = data._id;
        this.name = data.name;
        this.year = data.year;
        this.classes = data.classes;
        this.subjects = data.subjects;
        this.api?.successToast(`Successfully retrieved ${this.name}`);
      },
      error: (error) => {
        this.api?.errorToast(`Error occurred: ${error.toString()}`);
      },
    });
  }

  // function to retrieve students for the current scoresheet
}
