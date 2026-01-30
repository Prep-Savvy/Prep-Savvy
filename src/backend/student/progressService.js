"use server";

import { supabase } from "../config/supabaseClient";

export async function fetchProgress(studentEmail) {
  const { data: attempts } = await supabase
    .from("attempts")
    .select("score, total_questions, attempted_at")
    .eq("student_email", studentEmail)
    .order("attempted_at", { ascending: false });

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

  return {
    totalAttempts,
    averageScore: totalAttempts ? (totalScore / totalAttempts) : 0,
    attempts
  };
}