
import React, { useState, useEffect } from 'react';
import { Questionnaire, QuestionnaireType, ConsultationData, PatientDemographics } from '../types.ts';
import { Button } from './ui/Button.tsx';
import { TEXT_PRIMARY, PRIMARY_BLUE, LIGHT_BLUE, SECONDARY_BLUE, TEXT_SECONDARY } from '../constants.ts';

interface QuestionnaireModalProps {
  questionnaire: Questionnaire;
  consultationData: ConsultationData; 
  patientDemographics: PatientDemographics;
  onClose: () => void;
  onSubmit: (type: QuestionnaireType, score: number) => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ questionnaire, consultationData, patientDemographics, onClose, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [interpretationResult, setInterpretationResult] = useState<{text: string; details?: string[]} | null>(null);
  
  useEffect(() => {
    setAnswers({});
    setCurrentScore(null);
    setInterpretationResult(null);
  }, [questionnaire]);

  const handleOptionChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questionnaire.questions.length) {
      alert('Veuillez répondre à toutes les questions.');
      return;
    }
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    setCurrentScore(totalScore);
    if (questionnaire.interpretation) {
      setInterpretationResult(questionnaire.interpretation(totalScore, consultationData, patientDemographics));
    }
    onSubmit(questionnaire.id, totalScore);
  };

  const renderQuestionnaireForm = () => (
    <>
      <div className="overflow-y-auto space-y-6 pr-2 flex-grow modal-content-scroll">
        {questionnaire.questions.map((q, qIndex) => {
          let conditionalText: string | null = null;
          if (q.condition) {
            const conditionResult = q.condition(consultationData, patientDemographics);
            if (typeof conditionResult === 'string') {
              conditionalText = conditionResult;
            } else if (!conditionResult) { 
              return null; 
            }
          }
          return (
            <div key={q.id} className="mb-5">
              <p className={`text-base font-medium text-[${TEXT_PRIMARY}] mb-2`}>{`${qIndex + 1}. ${q.text}`}</p>
              {conditionalText && (
                <p className={`text-xs text-[${TEXT_SECONDARY}] mb-3 italic`}>{conditionalText}</p>
              )}
              <div className="space-y-2.5">
                {q.options.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center p-3.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out group border-2 
                      ${answers[q.id] === opt.value 
                        ? `bg-[${PRIMARY_BLUE}] text-white border-[${PRIMARY_BLUE}] shadow-md` 
                        : `bg-[${LIGHT_BLUE}] text-[${TEXT_PRIMARY}] border-transparent hover:bg-blue-200 hover:border-[${PRIMARY_BLUE}]`}
                    `}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleOptionChange(q.id, opt.value)}
                      className={`form-radio shrink-0 h-4 w-4 mr-3 appearance-none rounded-full border-2 
                        ${answers[q.id] === opt.value 
                          ? `bg-white border-white ring-2 ring-offset-1 ring-white`
                          : `border-gray-400 group-hover:border-[${PRIMARY_BLUE}]`} 
                        focus:ring-2 focus:ring-offset-1 focus:ring-[${PRIMARY_BLUE}] transition duration-150 ease-in-out`}
                    />
                    <span className="text-sm select-none">{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={handleSubmit} className="w-full mt-8 py-3.5">
        Valider et voir le score
      </Button>
    </>
  );

  const renderResultsView = () => (
    <>
      <div className="overflow-y-auto space-y-6 pr-2 flex-grow modal-content-scroll text-center">
        <div className={`p-6 rounded-lg bg-[${LIGHT_BLUE}]`}>
            <h3 className={`text-2xl font-bold text-[${SECONDARY_BLUE}] mb-3`}>Résultat du Questionnaire</h3>
            <p className={`text-3xl font-extrabold text-[${PRIMARY_BLUE}] mb-2`}>
                {interpretationResult?.text || `Score Total : ${currentScore}`}
            </p>
            {interpretationResult?.details && interpretationResult.details.length > 0 && (
                <div className="mt-4 text-left">
                    <h4 className={`text-md font-semibold text-[${TEXT_SECONDARY}] mb-1`}>Interprétation :</h4>
                    <ul className="list-disc list-inside text-sm text-[${TEXT_PRIMARY}] space-y-1">
                        {interpretationResult.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                        ))}
                    </ul>
                </div>
            )}
             <p className={`mt-4 text-xs text-[${TEXT_SECONDARY}]`}>
                Ces résultats sont basés sur vos réponses et fournissent une indication. Discutez-en avec un professionnel de santé.
            </p>
        </div>
      </div>
      <Button onClick={onClose} className="w-full mt-8 py-3.5" variant="secondary">
        Fermer
      </Button>
    </>
  );


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 print:hidden">
      <div className={`bg-white rounded-2xl shadow-2xl p-7 sm:p-10 max-w-2xl w-full max-h-[90vh] flex flex-col`}>
        <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 border-[${LIGHT_BLUE}]`}>
          <h2 className={`text-xl sm:text-2xl font-bold text-[${SECONDARY_BLUE}]`}>{questionnaire.title}</h2>
          {!interpretationResult && ( 
            <button
              onClick={onClose}
              className={`text-2xl text-[${TEXT_SECONDARY}] hover:text-[${SECONDARY_BLUE}] p-2 rounded-full transition-colors duration-200 ease-in-out hover:bg-[${LIGHT_BLUE}]`}
              aria-label="Close modal"
            >
              &times;
            </button>
          )}
        </div>
        
        {interpretationResult ? renderResultsView() : renderQuestionnaireForm()}

      </div>
       <style>{`
        .modal-content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content-scroll::-webkit-scrollbar-thumb {
          background-color: ${PRIMARY_BLUE};
          border-radius: 10px;
        }
        .modal-content-scroll::-webkit-scrollbar-track {
          background-color: ${LIGHT_BLUE};
        }
      `}</style>
    </div>
  );
};