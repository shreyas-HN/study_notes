export interface Subject {
  id: string | number;
  name: string;
  code: string;
}

export interface Note {
  id: string | number;
  subject_id: string | number;
  title: string;
  content: string;
}
