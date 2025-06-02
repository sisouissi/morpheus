
import React from 'react';
import { QuestionnaireScores, QuestionnaireType } from '../../types.ts';
import { Button } from '../ui/Button.tsx';
import { SectionWrapper } from '../SectionWrapper.tsx';
import { QUESTIONNAIRES, STEPS, TEXT_SECONDARY, GREEN_SUCCESS, PRIMARY_BLUE, LIGHT_BLUE, BORDER_LIGHT } from '../../constants.ts';

interface Step4Props {
  scores: QuestionnaireScores;
  openQuestionnaire: (type: QuestionnaireType) => void;
  nextStep: () => void;
  previousStep: () => void;
}

interface QuestionnaireCardProps {
  qType: QuestionnaireType;
  isCompleted: boolean;
  score?: number;
  onClick: (type: QuestionnaireType) => void;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ qType, isCompleted, score, onClick }) => {
  const questionnaireInfo = QUESTIONNAIRES[qType];
  if (!questionnaireInfo) return null;

  return (
    <div
      className={`bg-[${LIGHT_BLUE}] border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 
        ${isCompleted ? `border-[${GREEN_SUCCESS}] bg-gradient-to-br from-green-50 to-white` : `border-[${BORDER_LIGHT}] hover:border-[${PRIMARY_BLUE}]`}
      `}
      onClick={() => onClick(qType)}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir le questionnaire ${questionnaireInfo.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(qType)}
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 text-2xl text-white ${questionnaireInfo.iconBgGradient}`}>
          {questionnaireInfo.icon}
        </div>
        <h3 className={`text-lg font-semibold text-[#043873]`}>{questionnaireInfo.title}</h3>
      </div>
      <p className={`text-sm text-[${TEXT_SECONDARY}] mb-3 min-h-[40px]`}>{questionnaireInfo.description}</p>
      <div
        className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium
          ${isCompleted ? `bg-green-100 text-[${GREEN_SUCCESS}]` : `bg-yellow-100 text-yellow-700`}`}
      >
        {isCompleted ? `Complété (Score: ${score})` : 'En attente'}
      </div>
    </div>
  );
};

export const Step4Questionnaires: React.FC<Step4Props> = ({ scores, openQuestionnaire, nextStep, previousStep }) => {
  const currentStepConfig = STEPS.find(s => s.id === 4);
  if (!currentStepConfig) return null;
  
  return (
    <SectionWrapper stepConfig={currentStepConfig}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(QUESTIONNAIRES) as QuestionnaireType[]).map(qType => (
          <QuestionnaireCard
            key={qType}
            qType={qType}
            isCompleted={scores[qType] !== undefined}
            score={scores[qType]}
            onClick={openQuestionnaire}
          />
        ))}
      </div>
      <div className="mt-10 flex justify-between">
        <Button variant="secondary" onClick={previousStep}>← Précédent</Button>
        <Button onClick={nextStep}>Suivant →</Button>
      </div>
    </SectionWrapper>
  );
};