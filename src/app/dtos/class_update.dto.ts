
export interface ClassUpdateDTO {
  id: string;
  name: string;
  school_id: string;

  subjects?: string[];
  users?: string[];
  students?: string[];

  created_at: Date;
  updated_at: Date;
}
