//Create and publish daily practice sets

import { supabase } from '../config/supabaseClient';

export async function createDailySet({ date, created_by }) {
  if (!date || !created_by) throw new Error('date and created_by required');

  const dateStr = new Date(date).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_sets')
    .insert({
      date: dateStr,
      created_by,
      is_published: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to create daily set');
  return data;
}

export async function addQuestionsToDailySet(daily_set_id, questionIds = []) {
  if (!questionIds.length) throw new Error('Provide at least one question id');

  const rows = questionIds.map(qid => ({
    daily_set_id,
    question_id: qid
  }));

  const { error } = await supabase
    .from('daily_set_questions')
    .insert(rows);

  if (error) throw new Error(error.message || 'Failed to link questions');
  return { success: true, count: questionIds.length };
}

export async function setPublished(daily_set_id, is_published = true) {
  const { data, error } = await supabase
    .from('daily_sets')
    .update({ is_published })
    .eq('id', daily_set_id)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Daily set not found');
  return data;
}

export async function getDailySets({ date, is_published = true, limit = 10, page = 1 }) {
  let query = supabase
    .from('daily_sets')
    .select(`
      *,
      daily_set_questions (
        question_id,
        questions (
          id,
          question_text,
          options,
          correct_answer,
          question_type,
          topic
        )
      )
    `)
    .order('date', { ascending: false });

  if (date) query = query.eq('date', date);
  if (is_published !== null) query = query.eq('is_published', is_published);

  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);

  if (error) throw new Error(error.message || 'Cannot load daily sets');

  // Flatten questions into the set object (optional – makes frontend easier)
  const sets = data?.map(set => ({
    ...set,
    questions: set.daily_set_questions?.map(m => m.questions) || []
  })) || [];

  return {
    sets,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}