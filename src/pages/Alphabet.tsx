import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Download, BookOpen, Play } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Letter {
  character: string;
  romanization: string;
  type: 'consonant' | 'vowel';
  ipa: string;
  strokeOrder: string[];
  commonMistakes: string[];
  exampleWord: {
    word: string;
    meaning: string;
    pronunciation: string;
  };
}

const alphabet: Letter[] = [
  {
    character: 'ㄱ',
    romanization: 'g/k',
    type: 'consonant',
    ipa: '[k̚], [g]',
    strokeOrder: [
      'https://images.unsplash.com/photo-1234/g-stroke-1.png',
      'https://images.unsplash.com/photo-1234/g-stroke-2.png',
    ],
    commonMistakes: [
      'Making the angle too rounded',
      'Incorrect proportions between vertical and horizontal lines',
    ],
    exampleWord: {
      word: '가방',
      meaning: 'bag',
      pronunciation: 'gabang',
    },
  },
  {
    character: 'ㅈ',
    romanization: 'j',
    type: 'consonant',
    ipa: '[ja]',
    strokeOrder: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hangul_Jieut.svg/256px-Hangul_Jieut.svg.png',
    ],
    commonMistakes: [
      'confusing it with the double consonant "ㅉ"',
      'Uneven line lengths',
    ],
    exampleWord: {
      word: '자',
      meaning: 'ok',
      pronunciation: 'ja',
    },
  },
  {
    character: 'ㅏ',
    romanization: 'a',
    type: 'vowel',
    ipa: '[a]',
    strokeOrder: [
      'https://images.unsplash.com/photo-1234/a-stroke-1.png',
      'https://images.unsplash.com/photo-1234/a-stroke-2.png',
    ],
    commonMistakes: [
      'Making the vertical line too short',
      'Incorrect angle of the short line',
    ],
    exampleWord: {
      word: '아기',
      meaning: 'baby',
      pronunciation: 'agi',
    },
  },
];

const vowels = alphabet.filter(letter => letter.type === 'vowel');
const consonants = alphabet.filter(letter => letter.type === 'consonant');

const Alphabet = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const generatePDF = async () => {
    const element = document.getElementById('alphabet-content');
    const canvas = await html2canvas(element!);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('hangul-guide.pdf');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">한글 (Hangul)</h1>
          <p className="mt-2 text-gray-600">Master the Korean alphabet system</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={generatePDF}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Guide
          </button>
          <button className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-4 h-4 mr-2" />
            Start Practice
          </button>
        </div>
      </div>

      <div id="alphabet-content">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-4 mb-8">
            <Tabs.Trigger
              value="overview"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Overview
            </Tabs.Trigger>
            <Tabs.Trigger
              value="consonants"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'consonants'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Consonants (자음)
            </Tabs.Trigger>
            <Tabs.Trigger
              value="vowels"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'vowels'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vowels (모음)
            </Tabs.Trigger>
            <Tabs.Trigger
              value="practice"
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'practice'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Practice
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview" className="outline-none">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction to Hangul</h2>
              <p className="text-gray-700 mb-6">
                Hangul is the Korean alphabet system, created by King Sejong the Great in 1443. 
                It consists of 14 consonants (자음) and 10 basic vowels (모음), which can be combined 
                to form syllable blocks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Consonants (자음)</h3>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {consonants.map((letter) => (
                      <button
                        key={letter.character}
                        onClick={() => setSelectedLetter(letter)}
                        className="p-2 rounded-lg text-xl font-bold bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {letter.character}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Vowels (모음)</h3>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {vowels.map((letter) => (
                      <button
                        key={letter.character}
                        onClick={() => setSelectedLetter(letter)}
                        className="p-2 rounded-lg text-xl font-bold bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {letter.character}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="consonants" className="outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consonants.map((letter) => (
                <LetterCard key={letter.character} letter={letter} onSelect={setSelectedLetter} />
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="vowels" className="outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vowels.map((letter) => (
                <LetterCard key={letter.character} letter={letter} onSelect={setSelectedLetter} />
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="practice" className="outline-none">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Writing Practice Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Principles</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Write from top to bottom</li>
                      <li>Write from left to right</li>
                      <li>Maintain consistent character size</li>
                      <li>Follow proper stroke order</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Syllable Structure</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Initial consonant (초성)</li>
                      <li>Medial vowel (중성)</li>
                      <li>Optional final consonant (종성)</li>
                      <li>Example: 한 (han) = ㅎ + ㅏ + ㄴ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <Dialog.Root open={!!selectedLetter} onOpenChange={() => setSelectedLetter(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            {selectedLetter && (
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedLetter.character} ({selectedLetter.romanization})
                </Dialog.Title>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Stroke Order</h3>
                    <div className="space-y-4">
                      {selectedLetter.strokeOrder.map((stroke, index) => (
                        <div key={index} className="relative">
                          <img
                            src={stroke}
                            alt={`Stroke ${index + 1}`}
                            className="w-full rounded-lg border"
                          />
                          <span className="absolute top-2 left-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">IPA Pronunciation</p>
                        <p className="text-lg font-medium font-mono">{selectedLetter.ipa}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Example Word</p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xl font-bold">{selectedLetter.exampleWord.word}</p>
                          <p className="text-sm text-gray-600">{selectedLetter.exampleWord.pronunciation}</p>
                          <p className="text-sm text-gray-600">Meaning: {selectedLetter.exampleWord.meaning}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Common Mistakes to Avoid</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {selectedLetter.commonMistakes.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>
                </div>
                <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Dialog.Close>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

interface LetterCardProps {
  letter: Letter;
  onSelect: (letter: Letter) => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(letter)}
      className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-6xl font-bold text-indigo-600">{letter.character}</span>
          <span className="text-2xl font-bold text-gray-400 ml-2">{letter.romanization}</span>
        </div>
        <Play className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Example Word</p>
          <div className="bg-gray-50 px-3 py-2 rounded-lg mt-1">
            <p className="text-lg font-bold">{letter.exampleWord.word}</p>
            <p className="text-sm text-gray-600">{letter.exampleWord.meaning}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Click to view stroke order and details</p>
        </div>
      </div>
    </button>
  );
};

export default Alphabet;