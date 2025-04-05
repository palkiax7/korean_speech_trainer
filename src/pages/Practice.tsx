import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import SpeechTrainer from '../components/SpeechTrainer';

interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching';
  question: string;
  options?: string[];
  matches?: { left: string; right: string }[];
  correctAnswer: string | string[];
}

const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the correct romanization for ㄱ?',
    options: ['g/k', 'n', 'd/t', 'r/l'],
    correctAnswer: 'g/k',
  },
  {
    id: 2,
    type: 'fill-in-blank',
    question: 'The Korean letter ㅏ is pronounced as "_"',
    correctAnswer: 'a',
  },
];

const practicePhrases = [
  '안녕하세요',
  '감사합니다',
  '잘 지내요',
  '만나서 반갑습니다',
];

const Practice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedAnswer)
      : currentQuestion.correctAnswer === selectedAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);
    setProgress((prev) => Math.min(100, prev + (correct ? 10 : 0)));

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer('');
        setShowFeedback(false);
      }
    }, 1500);
  };

  const handleNextPhrase = () => {
    setCurrentPhraseIndex((prev) => (prev + 1) % practicePhrases.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Practice Korean</h1>
      
      <Tabs.Root defaultValue="quiz" className="space-y-6">
        <Tabs.List className="flex space-x-4 border-b border-gray-200">
          <Tabs.Trigger
            value="quiz"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-700 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
          >
            Quiz
          </Tabs.Trigger>
          <Tabs.Trigger
            value="speech"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-700 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
          >
            Speech Practice
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="quiz" className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProgressBar progress={progress} />
            
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {questions[currentQuestionIndex].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestionIndex].options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border ${selectedAnswer === option ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer && (
                <button
                  onClick={handleAnswerSubmit}
                  className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Answer
                </button>
              )}

              {showFeedback && (
                <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                </div>
              )}
            </motion.div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="speech" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Phrase {currentPhraseIndex + 1} of {practicePhrases.length}
            </h2>
            <button
              onClick={handleNextPhrase}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none"
            >
              Next Phrase →
            </button>
          </div>
          
          <SpeechTrainer targetPhrase={practicePhrases[currentPhraseIndex]} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Practice;