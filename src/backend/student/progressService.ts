import { supabase } from "../config/supabaseClient";

// Define the return type
export interface StudentProgress {
  totalAttempts: number;
  averageScore: number;
  attempts: Array<{
    score: number;
    total_questions: number;
    attempted_at: string;
    // topic?: string;   ← commented because it's NOT in your select query
  }>;
}

export async function fetchProgress(studentEmail: string): Promise<StudentProgress> {
  if (!studentEmail) {
    throw new Error("studentEmail is required");
  }

  const { data, error } = await supabase
    .from("attempts")
    .select("score, total_questions, attempted_at")
    .eq("student_email", studentEmail)
    .order("attempted_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch progress");
  }

  const attempts = data || [];

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + (a?.score || 0), 0);

  return {
    totalAttempts,
    averageScore: totalAttempts ? totalScore / totalAttempts : 0,
    attempts,
  };
}
