export class ScoresheetStudent {
  private classId: string;
  private studentName: string;
  private studentSurname: string;
  private mark?: number;

  constructor(classId: string, name: string, surname: string) {
    this.classId = classId;
    this.studentName = name;
    this.studentSurname = surname;
  }
}
