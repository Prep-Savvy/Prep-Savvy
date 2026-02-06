import { useState, useEffect } from 'react';
import { listQuestions } from '../../backend/admin/questionService';
import { createDailySet, addQuestionsToDailySet, setPublished, getDailySets } from '../../backend/admin/dailySetService';

import { Calendar, Send, CheckCircle, BookOpen } from 'lucide-react';

interface DailySet {
  id: string;
  date: string;
  category: string;
  questions: any[]; // from getDailySets flattened
  published: boolean;
}

interface Question {
  id: string;
  topic: string;
  question_text: string;
  difficulty: string;
}

export default function DailySetManager() {
  const [selectedCategory, setSelectedCategory] = useState('Aptitude');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [publishedSets, setPublishedSets] = useState<DailySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Coding'];

  // Fetch available questions on category change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { questions: data } = await listQuestions({
          topic: selectedCategory,
        });

        setAvailableQuestions(data || []);
        setSelectedQuestions([]); // reset selection on category change
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory]);

  // Fetch published sets on mount
  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const { sets } = await getDailySets({ date: undefined, is_published: true });
        setPublishedSets(sets || []);
      } catch (err) {
        console.error('Failed to load published sets', err);
      }
    };

    fetchPublished();
  }, []);

  const handleToggleQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handlePublish = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question to publish');
      return;
    }

    try {
      // 1. Create new daily set
      const newSet = await createDailySet({
        date: new Date(),
        created_by: 'ae32b198-11bc-474d-a04d-747737a9addf', // replace with real from auth
      });

      // 2. Add selected questions
      await addQuestionsToDailySet(newSet.id, selectedQuestions);

      // 3. Publish it
      await setPublished(newSet.id, true);

      // Refresh published sets
      const { sets } = await getDailySets({ date: undefined, is_published: true });
      setPublishedSets(sets || []);

      setSelectedQuestions([]);
      alert(`Successfully published ${selectedQuestions.length} questions for ${selectedCategory}!`);
    } catch (err) {
      setError('Failed to publish set');
      console.error(err);
      alert('Publish failed: ' + (err as Error).message);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Daily Set Manager</h1>
        <p className="text-slate-600">Select and publish daily practice questions for students</p>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-slate-600 mb-4">Loading...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Question Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Select Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    selectedCategory === category
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">
                Available Questions ({availableQuestions.length})
              </h3>
              <span className="text-sm text-slate-600">
                {selectedQuestions.length} selected
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {availableQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedQuestions.includes(question.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleToggleQuestion(question.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleToggleQuestion(question.id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium mb-2">{question.question_text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {question.topic}
                        </span>
                        <span className="text-xs text-slate-600">ID: {question.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Publish Panel */}
        <div className="space-y-6">
          {/* Publish Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6" />
              <h3 className="font-bold text-lg">Publish Daily Set</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-100 mb-1">Today's Date</p>
              <p className="font-bold text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-100 mb-1">Category</p>
              <p className="font-bold">{selectedCategory}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-100 mb-1">Questions Selected</p>
              <p className="font-bold text-2xl">{selectedQuestions.length}</p>
            </div>

            <button
              onClick={handlePublish}
              disabled={selectedQuestions.length === 0 || loading}
              className="w-full bg-white hover:bg-blue-50 text-blue-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Publish Set
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Sets Published Today</span>
                <span className="font-bold text-slate-900">-</span> {/* Add real count later */}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">This Week</span>
                <span className="font-bold text-slate-900">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Sets</span>
                <span className="font-bold text-slate-900">{publishedSets.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Published Sets History */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-lg text-slate-900">Recently Published Sets</h3>
        </div>
        
        <div className="space-y-3">
          {publishedSets.slice(0, 5).map((set) => (
            <div
              key={set.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{set.category}</h4>
                    <p className="text-sm text-slate-600">
                      {new Date(set.date).toLocaleDateString()} • {set.questions?.length || 0} questions
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Published
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}