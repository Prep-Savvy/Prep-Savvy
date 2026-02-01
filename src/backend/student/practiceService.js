//Fetch today’s questions for studentsimport { supabase } from "@/lib/supabaseClient";

"use server";

import { supabase } from "../config/supabaseClient";

export async function fetchTodaysQuestions() {
  const today = new Date().toISOString().split("T")[0];

  // 1. Get today's published daily set
  const { data: dailySet, error: setError } = await supabase
    .from("daily_sets")
    .select("id")
    .eq("date", today)
    .eq("is_published", true)
    .single();

  if (setError || !dailySet) {
    throw new Error("No daily set found for today");
  }

  // 2. Get question IDs for the daily set
  const { data: mappings } = await supabase
    .from("daily_set_questions")
    .select("question_id")
    .eq("daily_set_id", dailySet.id);

  const questionIds = mappings.map(m => m.question_id);

  // 3. Get actual questions
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, options, topic")
    .in("id", questionIds);

  return {
    dailySetId: dailySet.id,
    questions
  };
}