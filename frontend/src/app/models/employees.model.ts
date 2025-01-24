export interface Skill {
  code: string;
  description: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  hire_date: string;
  profile_picture: string;
  skills: Skill[];
}
