import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Flag } from 'lucide-react';

interface TestInterfaceProps {
  category: string;
  onBack: () => void;
  onSubmit: (score: number, total: number, questions: any[], userAnswers: number[]) => void;
  user: { name: string; email: string };
}

// Hardcoded your 10 questions with 4 options each and correct_answer index
const hardcodedQuestions = [
  {
    id: "q1",
    category: "Java",
    question: "Which keyword is used to create an object in Java?",
    options: ["new", "object", "create", "instance"],
    correctAnswer: 0, // new
  },
  {
    id: "q2",
    category: "Java",
    question: "What will be the output of: int x = 5; System.out.print(x++ + ++x);",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2, // 12
  },
  {
    id: "q3",
    category: "DSA",
    question: "Which data structure is best suited for implementing recursion?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1, // Stack
  },
  {
    id: "q4",
    category: "OS",
    question: "Deadlock occurs when:",
    options: ["Processes wait for each other forever", "CPU is busy", "Memory is full", "Disk is full"],
    correctAnswer: 0,
  },
  {
    id: "q5",
    category: "JavaScript",
    question: "Which JavaScript method can be used to find the largest element in an array?",
    options: ["Math.max(...arr)", "arr.max()", "Math.max(arr)", "arr.reduce()"],
    correctAnswer: 0,
  },
  {
    id: "q6",
    category: "Algorithms",
    question: "Which logic is best to check whether a number is prime?",
    options: ["Check divisibility from 2 to n-1", "Check divisibility from 2 to sqrt(n)", "Check only even numbers", "Check only odd numbers"],
    correctAnswer: 1,
  },
  {
    id: "q7",
    category: "C++",
    question: "int x = 4; cout << (x << 1); What will be the output?",
    options: ["4", "8", "2", "16"],
    correctAnswer: 1,
  },
  {
    id: "q8",
    category: "Programming Basics",
    question: "Which loop executes at least once even if the condition is false?",
    options: ["for", "while", "do-while", "foreach"],
    correctAnswer: 2,
  },
  {
    id: "q9",
    category: "Java",
    question: "What is the output of: System.out.print(10 / 3);",
    options: ["3", "3.333", "3.0", "Error"],
    correctAnswer: 0,
  },
  {
    id: "q10",
    category: "DSA",
    question: "What is the time complexity of binary search in a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correctAnswer: 1,
  }
];

export default function TestInterface({ category, onBack, onSubmit, user }: TestInterfaceProps) {
  const [questions] = useState(hardcodedQuestions);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

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

  const handleSubmit = async () => {
    // Calculate score locally — correct based on clicked index vs correct_answer index
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
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
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