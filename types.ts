
export interface PatientDemographics {
  lastname: string;
  firstname: string;
  birthdate: string;
  gender: string;
  profession: string;
}

export interface ConsultationData {
  height: string;
  weight: string;
  neckCircumference: string;
  antecedents: {
    hta: boolean;
    diabete: boolean;
    cardiopathie: boolean;
    avc: boolean;
    depression: boolean;
    hypothyroidie: boolean;
  };
  familyHistorySahos: boolean;
  nasalObstruction: boolean;
  gerd: boolean;
  currentTreatments: string;
  smoking: string;
  alcohol: string;
  symptoms: {
    ronflements: boolean;
    apnees: boolean;
    somnolence: boolean;
    fatigue: boolean;
    cephalees: boolean;
    nycturie: boolean;
    troublesConcentration: boolean;
  };
  morningDryMouth: boolean;
  nocturnalChokingGasping: boolean;
  mallampatiScore: string;
  tonsilSize: string;
  
  motivationSomnolence: boolean;
  motivationRonflements: boolean;
  motivationApneesEntourage: boolean;
  motivationBilanPreOp: boolean;
  motivationFatigueChronique: boolean;
  motivationHTAResistante: boolean;
  explorationReasonOther: string;

  sleepinessScale: number;

  consultationDate: string;
  // nextAppointmentDate?: string; // Removed
}

export interface QuestionnaireQuestionOption {
  value: number;
  text: string;
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  options: QuestionnaireQuestionOption[];
  condition?: (consultationData: ConsultationData, patientDemographics?: PatientDemographics) => boolean | string;
}

export interface Questionnaire {
  id: QuestionnaireType;
  title: string;
  icon: string;
  iconBgGradient: string;
  description: string;
  questions: QuestionnaireQuestion[];
  interpretation?: (score: number, consultationData?: ConsultationData, patientDemographics?: PatientDemographics) => { text: string; details?: string[] };
}

export type QuestionnaireType = 'epworth' | 'berlin' | 'stopBang' | 'fosq10';

export interface QuestionnaireScores {
  epworth?: number;
  berlin?: number;
  stopBang?: number;
  fosq10?: number;
}

export interface AppConclusion {
  summary: string[];
  recommendations: string[];
  riskLevel: 'Faible' | 'Modéré' | 'Élevé' | string; 
}

export type StepId = 1 | 2 | 3 | 4 | 5;

export interface Step {
  id: StepId;
  name: string;
  icon: string;
  iconBgGradient: string;
  title: string;
  description: string;
}

// Simplified consultation structure for the single report session
export interface ReportSession {
  data: ConsultationData;
  questionnaireScores: QuestionnaireScores;
  appConclusion: AppConclusion | null;
  completedSteps: StepId[];
}

// Data structure for saving the current session to localStorage
export interface CurrentSessionState {
  demographics: PatientDemographics;
  consultationData: ConsultationData;
  questionnaireScores: QuestionnaireScores;
  appConclusion: AppConclusion | null;
  currentStep: StepId;
  completedSteps: StepId[];
}

export type CombinedFormData = PatientDemographics & ConsultationData;