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

export interface Mission {
  id: number;
  name: string;
  description: string;
  start_date: Date;
  duration: number;
  status: string;
  skills: Skill[];
}
