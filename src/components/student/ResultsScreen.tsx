import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import type { Question } from './StudentDashboard';

interface ResultsScreenProps {
  score: number;
  total: number;
  category: string;
  questions: Question[];
  userAnswers: number[];
  onBackToHome: () => void;
}

export default function ResultsScreen({
  score,
  total,
  category,
  questions,
  userAnswers,
  onBackToHome
}: ResultsScreenProps) {
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Results Card */}
        <div className={`rounded-2xl p-8 mb-8 text-white relative overflow-hidden ${
          isPassed ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-orange-600 to-orange-700'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Test Completed!</h2>
                <p className="text-white/90 capitalize">{category} Practice Set</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white/80 text-sm mb-1">Score</p>
                <p className="text-4xl font-bold">{score}/{total}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white/80 text-sm mb-1">Percentage</p>
                <p className="text-4xl font-bold">{percentage}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white/80 text-sm mb-1">Status</p>
                <p className="text-2xl font-bold">{isPassed ? '✅ Passed' : '⚠️ Review'}</p>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1758518731027-78a22c8852ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHN1Y2Nlc3MlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjkxMzcyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900">Performance Insights</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-1">Correct Answers</p>
              <p className="text-3xl font-bold text-green-900">{score}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-1">Incorrect Answers</p>
              <p className="text-3xl font-bold text-red-900">{total - score}</p>
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Detailed Review</h3>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswerIndex = userAnswers[index];
              const isCorrect = userAnswerIndex === question.correctAnswer;
              const correctOption = question.options[question.correctAnswer];
              const userOption = userAnswerIndex === -1 ? "Not answered" : question.options[userAnswerIndex];

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-xl p-6 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium mb-3">{question.question}</p>
                      
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswerIndex === optIndex;
                          const isCorrectAnswer = question.correctAnswer === optIndex;
                          
                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer
                                  ? 'border-green-600 bg-green-100'
                                  : isUserAnswer && !isCorrectAnswer
                                  ? 'border-red-600 bg-red-100'
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <span className="text-green-600 font-bold">✓</span>}
                                {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 font-bold">✗</span>}
                                <span className={`${
                                  isCorrectAnswer || (isUserAnswer && !isCorrectAnswer) ? 'font-medium' : ''
                                } ${
                                  isCorrectAnswer ? 'text-green-900' : (isUserAnswer && !isCorrectAnswer) ? 'text-red-900' : 'text-slate-700'
                                }`}>
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <span className="ml-auto text-xs text-green-700 font-semibold">Correct Answer</span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="ml-auto text-xs text-red-700 font-semibold">Your Answer</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {!isCorrect && userAnswerIndex !== -1 && (
                        <p className="text-sm text-red-700 mt-2">
                          Correct answer: <span className="font-medium">{correctOption}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onBackToHome}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
