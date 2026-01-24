import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const categories = ['All', 'Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Coding'];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
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

      {/* Filters */}
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

      {/* Stats */}
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
          <p className="text-2xl font-bold text-slate-900">+24</p>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Question</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Difficulty</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-slate-900 font-medium line-clamp-2">{question.question}</p>
                    <p className="text-sm text-slate-600 mt-1">
                      {question.options.length} options • Answer: {question.options[question.correctAnswer]}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {question.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        question.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : question.difficulty === 'Medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(question.createdAt).toLocaleDateString()}
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
          onSave={(question) => {
            if (editingQuestion) {
              setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
            } else {
              setQuestions([...questions, { ...question, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
            }
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}

// Question Modal Component
function QuestionModal({
  question,
  onClose,
  onSave
}: {
  question: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
}) {
  const [formData, setFormData] = useState<Omit<Question, 'id' | 'createdAt'>>({
    category: question?.category || 'Aptitude',
    question: question?.question || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer || 0,
    difficulty: question?.difficulty || 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: question?.id || Date.now().toString(),
      ...formData,
      createdAt: question?.createdAt || new Date().toISOString()
    });
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>Aptitude</option>
                <option>Logical Reasoning</option>
                <option>Verbal Ability</option>
                <option>Coding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Question Text</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData({ ...formData, correctAnswer: index })}
                  className="w-4 h-4 text-blue-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <p className="text-xs text-slate-600 mt-2">Select the radio button for the correct answer</p>
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

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'Aptitude',
    question: 'If a train travels 360 km in 4 hours, what is its average speed?',
    options: ['80 km/h', '85 km/h', '90 km/h', '95 km/h'],
    correctAnswer: 2,
    difficulty: 'Easy',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: '2',
    category: 'Logical Reasoning',
    question: 'Complete the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    difficulty: 'Medium',
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: '3',
    category: 'Verbal Ability',
    question: 'Choose the synonym of "METICULOUS":',
    options: ['Careless', 'Careful', 'Reckless', 'Hasty'],
    correctAnswer: 1,
    difficulty: 'Easy',
    createdAt: '2026-01-21T09:00:00Z'
  },
  {
    id: '4',
    category: 'Coding',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
    correctAnswer: 1,
    difficulty: 'Medium',
    createdAt: '2026-01-21T14:00:00Z'
  },
  {
    id: '5',
    category: 'Aptitude',
    question: 'What is 15% of 240?',
    options: ['30', '32', '36', '40'],
    correctAnswer: 2,
    difficulty: 'Easy',
    createdAt: '2026-01-22T08:00:00Z'
  }
];
