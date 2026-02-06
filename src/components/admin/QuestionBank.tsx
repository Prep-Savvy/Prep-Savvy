import { useState, useEffect } from 'react';
import { listQuestions, addQuestion, updateQuestion, deleteQuestion } from '../../backend/admin/questionService';

import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface Question {
  id: string;
  topic: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  question_type: string;
  created_at: string;
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // trigger re-fetch after mutations

  const categories = ['All', 'Aptitude', 'Logical Reasoning', 'Verbal', 'Basics of Coding'];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all questions (large limit to avoid pagination loss)
        const response = await listQuestions({
          topic: filterCategory === 'All' ? undefined : filterCategory,
          search: searchTerm || undefined,
          limit: 1000, // safe for admin view - gets everything
        });

        setQuestions(response.questions || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filterCategory, searchTerm, refreshKey]);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || q.topic === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
      setRefreshKey((prev) => prev + 1); // refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  const handleSave = async (formData: Omit<Question, 'id' | 'created_at'>) => {
    try {
      let savedQuestion: Question;

      if (editingQuestion) {
        savedQuestion = await updateQuestion(editingQuestion.id, formData);
        setQuestions(questions.map((q) => (q.id === savedQuestion.id ? savedQuestion : q)));
      } else {
        savedQuestion = await addQuestion({
          ...formData,
          created_by: 'ae32b198-11bc-474d-a04d-747737a9addf', // replace with real admin ID from auth
        });
        setQuestions([...questions, savedQuestion]);
      }

      setShowAddModal(false);
      setEditingQuestion(null);
      setRefreshKey((prev) => prev + 1); // force re-fetch
    } catch (err: any) {
      setError(err.message || 'Failed to save question');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Question Bank</h1>
          <p className="text-slate-600">Manage all practice questions</p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-slate-600 mb-4">Loading questions...</p>}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Total Questions</p>
          <p className="text-2xl font-bold text-slate-900">{questions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Filtered Results</p>
          <p className="text-2xl font-bold text-slate-900">{filteredQuestions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">Categories</p>
          <p className="text-2xl font-bold text-slate-900">{categories.length - 1}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-1">This Month</p>
          <p className="text-2xl font-bold text-slate-900">-</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Question</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Topic</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-slate-900 font-medium line-clamp-2">{question.question_text}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {question.options.length} options • Answer: {question.correct_answer}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {question.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {question.question_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(question.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(question)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Fixed QuestionModal with proper typing
function QuestionModal({
  question,
  onClose,
  onSave,
}: {
  question: Question | null;
  onClose: () => void;
  onSave: (formData: Omit<Question, 'id' | 'created_at'>) => void;
}) {
  const [formData, setFormData] = useState({
    topic: question?.topic || 'Aptitude',
    question_text: question?.question_text || '',
    options: question?.options || ['', '', '', ''],
    correct_answer: question?.correct_answer || '',
    question_type: question?.question_type || 'mcq',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          {question ? 'Edit Question' : 'Add New Question'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>Aptitude</option>
                <option>Logical Reasoning</option>
                <option>Verbal</option>
                <option>Basics of Coding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={formData.question_type}
                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>mcq</option>
                <option>short_answer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Question Text</label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Options (comma separated for MCQ)</label>
            <input
              type="text"
              value={formData.options.join(', ')}
              onChange={(e) => {
                const opts = e.target.value.split(',').map((o) => o.trim());
                setFormData({ ...formData, options: opts });
              }}
              placeholder="Option 1, Option 2, Option 3, Option 4"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Correct Answer</label>
            <input
              type="text"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              placeholder="Enter the correct option text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {question ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}