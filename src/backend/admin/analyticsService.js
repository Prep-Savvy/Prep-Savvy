//Fetch student attempts for admin view

import { supabase } from '../config/supabaseClient';

export async function getAttemptsOverview({ startDate, endDate, daily_set_id } = {}) {
  let query = supabase
    .from('attempts')
    .select(`
      id,
      student_name,
      student_email,
      daily_set_id,
      score,
      total_questions,
      attempted_at
    `);

  if (startDate) query = query.gte('attempted_at', startDate);
  if (endDate)   query = query.lte('attempted_at', endDate);
  if (daily_set_id) query = query.eq('daily_set_id', daily_set_id);

  const { data, error } = await query;

  if (error) throw new Error(error.message || 'Failed to load analytics');

  if (!data?.length) {
    return {
      totalAttempts: 0,
      averagePercentage: 0,
      totalQuestionsAttempted: 0,
      topStudents: []
    };
  }

  let totalScore = 0;
  let totalQuestions = 0;
  const studentMap = new Map();

  data.forEach(a => {
    totalScore += a.score;
    totalQuestions += a.total_questions;

    const key = a.student_email || a.student_name || 'anonymous';
    if (!studentMap.has(key)) {
      studentMap.set(key, { count: 0, totalScore: 0, totalQ: 0 });
    }

    const entry = studentMap.get(key);
    entry.count++;
    entry.totalScore += a.score;
    entry.totalQ += a.total_questions;
  });

  const topStudents = Array.from(studentMap.entries())
    .map(([identifier, stats]) => ({
      identifier,
      attempts: stats.count,
      avgPercentage: stats.totalQ ? Math.round((stats.totalScore / stats.totalQ) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.avgPercentage - a.avgPercentage)
    .slice(0, 10);

  const averagePercentage = totalQuestions
    ? Math.round((totalScore / totalQuestions) * 1000) / 10
    : 0;

  return {
    totalAttempts: data.length,
    averagePercentage,
    totalQuestionsAttempted: totalQuestions,
    topStudents
  };
}

export async function getAttemptsList({
  daily_set_id,
  student_email,
  startDate,
  endDate,
  limit = 20,
  page = 1
}) {
  let query = supabase
    .from('attempts')
    .select('*', { count: 'exact' })
    .order('attempted_at', { ascending: false });

  if (daily_set_id)   query = query.eq('daily_set_id', daily_set_id);
  if (student_email)  query = query.eq('student_email', student_email);
  if (startDate)      query = query.gte('attempted_at', startDate);
  if (endDate)        query = query.lte('attempted_at', endDate);

  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);

  if (error) throw new Error(error.message || 'Failed to load attempts list');

  return {
    attempts: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}