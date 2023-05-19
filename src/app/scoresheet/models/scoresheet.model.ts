export interface IClassScoresheet {
  index: number;
  _id: string;
  name: string;
  surname: string;
  subjects: {
    name: string;
    teacher: {
      title: string;
      name: string;
      surname: string;
    };
  }[];
  marks: string[];
  aggregate: number;
  position: number;
  pass_fail: string;
}
