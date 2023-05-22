export interface IPassControls {
  _id?: string;
  scoresheet_id: string;
  name: string;
  mark: number;
  aggregate: number;
  num_passed_subject: number;
  other_subjects_mark: number;
  level: string;
}
