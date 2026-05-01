export type DegreeLevel = "S1" | "S2" | "S3";

export type Alumni = {
  id: string;
  user_id?: string;
  full_name: string;
  username?: string;
  intake_year: number;
  degree_level: DegreeLevel;
  institution?: string;
  field?: string;
  location?: string;
  avatar_url?: string;
  headline?: string; // job/role singkat
};