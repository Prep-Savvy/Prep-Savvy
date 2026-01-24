import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Flag } from 'lucide-react';
import type { Question } from './StudentDashboard';

interface TestInterfaceProps {
  category: string;
  onBack: () => void;
  onSubmit: (score: number, total: number, questions: Question[], userAnswers: number[]) => void;
}

export default function TestInterface({ category, onBack, onSubmit }: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Mock questions based on category
  const questions: Question[] = generateMockQuestions(category);

  // Initialize answers array
  useEffect(() => {
    setUserAnswers(new Array(questions.length).fill(-1));
  }, [questions.length]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const score = userAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    onSubmit(score, questions.length, questions, userAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = userAnswers.filter(a => a !== -1).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{answeredCount}</span> / {questions.length} answered
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-slate-600 capitalize">{category}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{currentQuestionIndex + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-lg text-slate-900 leading-relaxed">{currentQuestion.question}</p>
              </div>
            </div>
            {currentQuestion.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                currentQuestion.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-700' 
                  : currentQuestion.difficulty === 'Medium'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {userAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`${
                    userAnswers[currentQuestionIndex] === index
                      ? 'text-slate-900 font-medium'
                      : 'text-slate-700'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : userAnswers[index] !== -1
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span className="text-slate-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
              <span className="text-slate-600">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 rounded" />
              <span className="text-slate-600">Not Answered</span>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Submit Test?</h3>
            <p className="text-slate-600 mb-2">
              You have answered <span className="font-semibold text-slate-900">{answeredCount}</span> out of{' '}
              <span className="font-semibold text-slate-900">{questions.length}</span> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-orange-600 text-sm mb-6">
                ⚠️ You have {questions.length - answeredCount} unanswered questions.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock questions
function generateMockQuestions(category: string): Question[] {
  const questionsByCategory: Record<string, Question[]> = {
    aptitude: [
      {
        id: '1',
        category: 'aptitude',
        question: 'If a train travels 360 km in 4 hours, what is its average speed?',
        options: ['80 km/h', '85 km/h', '90 km/h', '95 km/h'],
        correctAnswer: 2,
        difficulty: 'Easy'
      },
      {
        id: '2',
        category: 'aptitude',
        question: 'What is 15% of 240?',
        options: ['30', '32', '36', '40'],
        correctAnswer: 2,
        difficulty: 'Easy'
      },
      {
        id: '3',
        category: 'aptitude',
        question: 'If the ratio of boys to girls in a class is 3:2 and there are 45 students, how many are girls?',
        options: ['15', '18', '20', '27'],
        correctAnswer: 1,
        difficulty: 'Medium'
      },
      {
        id: '4',
        category: 'aptitude',
        question: 'A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?',
        options: ['₹550', '₹600', '₹620', '₹650'],
        correctAnswer: 1,
        difficulty: 'Medium'
      },
      {
        id: '5',
        category: 'aptitude',
        question: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years?',
        options: ['₹2,000', '₹2,100', '₹2,200', '₹2,500'],
        correctAnswer: 1,
        difficulty: 'Hard'
      }
    ],
    logical: [
      {
        id: '1',
        category: 'logical',
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correctAnswer: 1,
        difficulty: 'Medium'
      },
      {
        id: '2',
        category: 'logical',
        question: 'If COMPUTER is coded as DPNQVUFS, how is LAPTOP coded?',
        options: ['MBQUPQ', 'MBQURQ', 'MCQUPQ', 'MBQUPR'],
        correctAnswer: 0,
        difficulty: 'Hard'
      },
      {
        id: '3',
        category: 'logical',
        question: 'Which number does not belong: 2, 3, 6, 7, 8, 14, 15, 30',
        options: ['3', '6', '8', '30'],
        correctAnswer: 2,
        difficulty: 'Medium'
      },
      {
        id: '4',
        category: 'logical',
        question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.',
        options: ['True', 'False', 'Cannot be determined', 'None of these'],
        correctAnswer: 0,
        difficulty: 'Easy'
      }
    ],
    verbal: [
      {
        id: '1',
        category: 'verbal',
        question: 'Choose the synonym of "METICULOUS":',
        options: ['Careless', 'Careful', 'Reckless', 'Hasty'],
        correctAnswer: 1,
        difficulty: 'Easy'
      },
      {
        id: '2',
        category: 'verbal',
        question: 'Choose the antonym of "ABUNDANCE":',
        options: ['Plenty', 'Scarcity', 'Wealth', 'Prosperity'],
        correctAnswer: 1,
        difficulty: 'Easy'
      },
      {
        id: '3',
        category: 'verbal',
        question: 'Fill in the blank: She was _____ by the sudden noise.',
        options: ['startled', 'starting', 'starts', 'startling'],
        correctAnswer: 0,
        difficulty: 'Medium'
      },
      {
        id: '4',
        category: 'verbal',
        question: 'Which sentence is grammatically correct?',
        options: [
          'Neither of the students have completed the assignment.',
          'Neither of the students has completed the assignment.',
          'Neither of the student have completed the assignment.',
          'Neither of the student has completed the assignment.'
        ],
        correctAnswer: 1,
        difficulty: 'Hard'
      }
    ],
    coding: [
      {
        id: '1',
        category: 'coding',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 1,
        difficulty: 'Easy'
      },
      {
        id: '2',
        category: 'coding',
        question: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        difficulty: 'Easy'
      },
      {
        id: '3',
        category: 'coding',
        question: 'What will be the output of: print(2 ** 3 ** 2)?',
        options: ['64', '512', '256', '128'],
        correctAnswer: 1,
        difficulty: 'Hard'
      },
      {
        id: '4',
        category: 'coding',
        question: 'Which sorting algorithm has the best average-case time complexity?',
        options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
        correctAnswer: 2,
        difficulty: 'Medium'
      }
    ]
  };

  return questionsByCategory[category] || questionsByCategory.aptitude;
}