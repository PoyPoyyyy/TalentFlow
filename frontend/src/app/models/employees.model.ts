export interface Skill {
  code: string;
  description: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  hire_date: string;
  type: string;
  email: string;
  password: string;
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
  skills: {skill: Skill, quantity: number}[];
  employees: Employee[];
}
