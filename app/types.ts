export type Video = {
  id: string | null;
  title: string | null;
  chapter: string | null;
};

export type Exercise = {
  id: string | null;
  title: string | null;
  chapter: string | null;
};

export type Teacher = {
  id: string | null;
  name: string | null;
};

export type Field = {
  id: string | null;
  name: string | null;
};

export type Course = {
  id: string;
  name: string | null;
  enroll_time?: string | null;
  n_courses?: number | null;
  schools?: string[] | [];
  n_teachers?: number | null;
  teachers?: Teacher[] | [];
  n_fields?: number | null;
  fields?: Field[] | null;
  prerequisites?: string[] | [];
  about?: string | null;
  n_users?: number | null;
  n_videos?: number | null;
  n_exercises?: number | null;
  videos?: Video[] | [];
  exercises?: Exercise[] | [];
};

export type User = {
  id: string;
  name: string | null;
  gender: 0 | 1 | 2 | null;
  school: string | null;
  year_of_birth: string | null;
  courses?: Course[];
};
