export interface IScoresheetDatasource {
  index: number;
  _id: string;
  name: string;
  surname: string;
  marks: string[];
  aggregate: number;
  position: number;
  pass_fail: string;
}
