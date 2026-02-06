import { supabase } from "../config/supabaseClient";

export async function submitAttempt(
  name,
  email,
  dailySetId,
  answers
) {
  if (!answers || answers.length === 0) {
    throw new Error("No answers provided");
  }

  /* ---------------- STEP 1: Validate Daily Set ---------------- */
  const { data: dailySet, error: dailySetError } = await supabase
    .from("daily_sets")
    .select("id")
    .eq("id", dailySetId)
    .single();

  if (dailySetError || !dailySet) {
    throw new Error(`Invalid daily set ID: ${dailySetId}`);
  }

  /* ---------------- STEP 2: Fetch Questions + Correct Answers ---------------- */
  const { data: mappings, error: mappingError } = await supabase
    .from("daily_set_questions")
    .select(`
      question_id,
      questions (
        correct_answer
      )
    `)
    .eq("daily_set_id", dailySetId);

  if (mappingError || !mappings || mappings.length === 0) {
    throw new Error("No questions found for this daily set");
  }

  /* ---------------- STEP 3: Create Correct Answer Map ---------------- */
  const correctAnswerMap = {};
  mappings.forEach((row) => {
    correctAnswerMap[row.question_id] = row.questions.correct_answer;
  });

  const totalQuestions = Object.keys(correctAnswerMap).length;
  let score = 0;

  /* ---------------- STEP 4: Validate & Prepare Answers ---------------- */
  const preparedAnswers = answers.map((ans) => {
    if (!correctAnswerMap[ans.questionId]) {
      throw new Error(`Invalid question ID: ${ans.questionId}`);
    }

    const isCorrect = ans.selectedAnswer === correctAnswerMap[ans.questionId];

    if (isCorrect) score++;

    return {
      question_id: ans.questionId,
      selected_answer: ans.selectedAnswer,
      is_correct: isCorrect
    };
  });

  /* ---------------- STEP 5: Insert Attempt ---------------- */
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .insert({
      student_name: name,
      student_email: email,
      daily_set_id: dailySetId,
      score: score,
      total_questions: totalQuestions,
      attempted_at: new Date().toISOString()
    })
    .select('id')   // lowercase 'id' — this fixes the 400
    .single();      // returns one row safely

  if (attemptError) {
    console.error("Attempt insert error:", attemptError);
    throw new Error(`Failed to save attempt: ${attemptError.message}`);
  }

  if (!attempt || !attempt.id) {
    throw new Error("No attempt ID returned from insert");
  }

  const attemptId = attempt.id;

  /* ---------------- STEP 6: Insert Attempt Answers ---------------- */
  const answerRows = preparedAnswers.map((a) => ({
    ...a,
    attempt_id: attemptId
  }));

  const { error: answersError } = await supabase
    .from("attempt_answers")
    .insert(answerRows);

  if (answersError) {
    console.error("Answers insert error:", answersError);
    throw new Error(`Failed to save answers: ${answersError.message}`);
  }

  return {
    message: "Attempt submitted successfully",
    score,
    totalQuestions
  };
}