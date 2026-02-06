//Add, edit, delete questions

import { supabase } from '../config/supabaseClient';

export async function listQuestions(filters = {}) {
  const { topic, question_type, search, limit = 20, page = 1 } = filters;

  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (topic) query = query.eq('topic', topic);
  if (question_type) query = query.eq('question_type', question_type);
  if (search) query = query.ilike('question_text', `%${search}%`);

  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);

  if (error) throw new Error(error.message || 'Cannot load questions');

  return {
    questions: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

export async function getQuestionById(id) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Question not found');

  return data;
}

export async function addQuestion({
  question_text,
  options,                // array of strings
  correct_answer,         // string (your table uses text type)
  question_type = 'mcq',
  topic = '',
  created_by              // uuid of the logged-in admin
}) {
  if (!question_text?.trim()) throw new Error('Question text is required');
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error('At least 2 options required');
  }
  if (!correct_answer?.trim()) throw new Error('Correct answer is required');

  const { data, error } = await supabase
    .from('questions')
    .insert({
      question_text,
      options,
      correct_answer,
      question_type,
      topic,
      created_by,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(error.message || 'Failed to create question');
  return data;
}

export async function updateQuestion(id, updates) {
  const allowed = ['question_text', 'options', 'correct_answer', 'question_type', 'topic'];

  const payload = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  if (Object.keys(payload).length === 0) {
    throw new Error('No updatable fields provided');
  }

  const { data, error } = await supabase
    .from('questions')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Question not found or permission denied');

  return data;
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw new Error(error.message || 'Delete failed');
  return { success: true, id };
}