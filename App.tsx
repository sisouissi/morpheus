
import React, { useState, useCallback, ChangeEvent, useEffect, useMemo } from 'react';
import { TopNavbar } from './components/TopNavbar.tsx';
import { ProgressNavbar } from './components/ProgressNavbar.tsx';
import { Step1Demographics } from './components/steps/Step1Demographics.tsx';
import { Step2History } from './components/steps/Step2History.tsx';
import { Step3Clinical } from './components/steps/Step3Clinical.tsx';
import { Step4Questionnaires } from './components/steps/Step4Questionnaires.tsx';
import { Step5Conclusion } from './components/steps/Step6AIDiagnosis.tsx'; 
import { QuestionnaireModal } from './components/QuestionnaireModal.tsx';
import { 
  PatientDemographics, ConsultationData, QuestionnaireScores, AppConclusion, 
  QuestionnaireType, StepId, CombinedFormData,
  ReportSession, CurrentSessionState
} from './types.ts';
import { 
  INITIAL_PATIENT_DEMOGRAPHICS, INITIAL_CONSULTATION_DATA, 
  QUESTIONNAIRES, STEPS, TEXT_SECONDARY, PRIMARY_BLUE
} from './constants.ts';

const LOCAL_STORAGE_SESSION_KEY = 'sahosApp_currentSession_simplified'; // Changed key to avoid conflict with old structure

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [patientDemographics, setPatientDemographics] = useState<PatientDemographics>(INITIAL_PATIENT_DEMOGRAPHICS);
  const [consultationData, setConsultationData] = useState<ConsultationData>(INITIAL_CONSULTATION_DATA);
  const [questionnaireScores, setQuestionnaireScores] = useState<QuestionnaireScores>({});
  const [appConclusion, setAppConclusion] = useState<AppConclusion | null>(null);
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<QuestionnaireType | null>(null);
  const [isGeneratingConclusion, setIsGeneratingConclusion] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (storedSession) {
        const sessionState: CurrentSessionState = JSON.parse(storedSession);
        setPatientDemographics(sessionState.demographics);
        setConsultationData(sessionState.consultationData);
        setQuestionnaireScores(sessionState.questionnaireScores);
        setAppConclusion(sessionState.appConclusion);
        setCurrentStep(sessionState.currentStep);
        setCompletedSteps(sessionState.completedSteps);
      }
    } catch (error) {
      console.error("Failed to load session from localStorage:", error);
      // If loading fails, start with initial state (already set by useState)
    }
  }, []);

  const saveCurrentSession = useCallback(() => {
    try {
      const sessionState: CurrentSessionState = {
        demographics: patientDemographics,
        consultationData: consultationData,
        questionnaireScores: questionnaireScores,
        appConclusion: appConclusion,
        currentStep: currentStep,
        completedSteps: completedSteps,
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionState));
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
    }
  }, [patientDemographics, consultationData, questionnaireScores, appConclusion, currentStep, completedSteps]);

  // Save session on important state changes
  useEffect(() => {
    saveCurrentSession();
  }, [saveCurrentSession]);


  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const targetInput = e.target as HTMLInputElement;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? targetInput.checked : undefined;
    const category = targetInput.dataset?.category; 
    const fieldName = name;

    setPatientDemographics(prevDemo => {
      if (fieldName in prevDemo && !category) { 
        return { ...prevDemo, [fieldName]: value };
      }
      return prevDemo;
    });

    setConsultationData(prevConsultData => {
      let newConsultData = { ...prevConsultData };

      if (category === "antecedents" && isCheckbox && checked !== undefined) {
        newConsultData.antecedents = { ...newConsultData.antecedents, [fieldName as keyof ConsultationData['antecedents']]: checked };
      } else if (category === "symptoms" && isCheckbox && checked !== undefined) {
        newConsultData.symptoms = { ...newConsultData.symptoms, [fieldName as keyof ConsultationData['symptoms']]: checked };
      } else if (category === 'root' && isCheckbox && checked !== undefined) { 
         type RootLevelBooleanKeys = { [K in keyof ConsultationData]: ConsultationData[K] extends boolean ? K : never; }[keyof ConsultationData];
         newConsultData = { ...newConsultData, [fieldName as RootLevelBooleanKeys]: checked };
      } else if (fieldName in newConsultData && (!category || category === "none")) {
        if (fieldName === 'sleepinessScale') {
          newConsultData.sleepinessScale = parseFloat(value);
        } else {
          (newConsultData as any)[fieldName] = (type === 'number' && fieldName !== 'nextAppointmentDate' && fieldName !== 'consultationDate') ? parseFloat(value) : value;
        }
      }
      return newConsultData;
    });
  }, []);


  const validateStep = (step: StepId): boolean => {
    const combinedData = { ...patientDemographics, ...consultationData };

    switch (step) {
      case 1:
        return !!(combinedData.lastname && combinedData.firstname && combinedData.birthdate && combinedData.gender && 
                  combinedData.consultationDate);
      case 2: 
        return true; 
      case 3: 
        const hasSelectedMotivation = 
            consultationData.motivationSomnolence ||
            consultationData.motivationRonflements ||
            consultationData.motivationApneesEntourage ||
            consultationData.motivationBilanPreOp ||
            consultationData.motivationFatigueChronique ||
            consultationData.motivationHTAResistante;
        return hasSelectedMotivation || !!consultationData.explorationReasonOther.trim();
      case 4: 
         // Only Epworth and STOP-BANG are mandatory
         return questionnaireScores.epworth !== undefined && questionnaireScores.stopBang !== undefined;
      default: return true;
    }
  };

  const markStepCompleted = useCallback((step: StepId) => {
    setCompletedSteps(prevCompleted => {
      if (prevCompleted.includes(step)) return prevCompleted;
      return [...prevCompleted, step].sort((a, b) => a - b) as StepId[];
    });
  }, []);
  
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      markStepCompleted(currentStep);
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => (prev + 1) as StepId);
      }
    } else {
      let alertMessage = "Veuillez remplir tous les champs obligatoires de cette étape.";
      if (currentStep === 4) {
        alertMessage = "Veuillez compléter au moins les questionnaires d'Epworth et STOP-BANG pour continuer."
      }
      alert(alertMessage);
    }
  }, [currentStep, validateStep, markStepCompleted, questionnaireScores]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as StepId);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: StepId) => {
     if (completedSteps.includes(step) || step === 1 || step === currentStep) {
        setCurrentStep(step);
     } else if (step > currentStep && validateStep(currentStep as StepId) && completedSteps.includes((step-1) as StepId) ) {
        markStepCompleted(currentStep); 
        setCurrentStep(step);
     } else if (step < currentStep ) { 
        setCurrentStep(step);
     } else if (validateStep((currentStep-1) as StepId)){ 
        setCurrentStep(step);
     }
  }, [completedSteps, currentStep, validateStep, markStepCompleted]); 

  const openQuestionnaire = (type: QuestionnaireType) => setActiveQuestionnaire(type);
  const closeQuestionnaire = () => setActiveQuestionnaire(null);

  const submitQuestionnaireScore = (type: QuestionnaireType, score: number) => {
    setQuestionnaireScores(prev => ({ ...prev, [type]: score }));
  };
  
  const calculateBMI = (heightStr: string, weightStr: string): number => {
    const height = parseFloat(heightStr);
    const weight = parseFloat(weightStr);
    if (!height || !weight || height <=0 || weight <=0) return 0;
    return weight / ((height / 100) ** 2);
  };

  const getAge = (birthdate: string): number => {
    if (!birthdate) return 0;
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age;
  };

  const generateConclusion = () => {
    setIsGeneratingConclusion(true);
    const summary: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: AppConclusion['riskLevel'] = 'Faible'; 
    
    const { birthdate, gender, firstname, lastname } = patientDemographics;

    const age = getAge(birthdate);
    const bmi = calculateBMI(consultationData.height, consultationData.weight);
    summary.push(`Rapport pour ${firstname} ${lastname}, âgé(e) de ${age} ans, sexe ${gender === 'M' ? 'masculin' : 'féminin'}.`);
    summary.push(`Date du rapport: ${new Date(consultationData.consultationDate).toLocaleDateString('fr-FR')}.`);
    
    summary.push(`Taille: ${consultationData.height} cm, Poids: ${consultationData.weight} kg, IMC: ${bmi > 0 ? bmi.toFixed(1) : 'N/A'} kg/m². Tour de cou: ${consultationData.neckCircumference || 'N/A'} cm.`);
    const reportedSymptoms = Object.entries(consultationData.symptoms).filter(([, value]) => value).map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
    summary.push(reportedSymptoms.length > 0 ? `Symptômes rapportés : ${reportedSymptoms.join(', ')}.` : "Aucun symptôme principal rapporté.");
    
    const motivations: string[] = [];
    if (consultationData.motivationSomnolence) motivations.push("Somnolence diurne");
    if (consultationData.motivationRonflements) motivations.push("Ronflements importants");
    if (consultationData.motivationApneesEntourage) motivations.push("Apnées rapportées par l'entourage");
    if (consultationData.motivationBilanPreOp) motivations.push("Bilan pré-opératoire");
    if (consultationData.motivationFatigueChronique) motivations.push("Fatigue chronique");
    if (consultationData.motivationHTAResistante) motivations.push("HTA résistante");
    if (consultationData.explorationReasonOther) motivations.push(`Autre: ${consultationData.explorationReasonOther}`);
    summary.push(motivations.length > 0 ? `Motivation(s) de l'exploration : ${motivations.join(', ')}.` : "Aucune motivation spécifique d'exploration rapportée.");

    summary.push(`Échelle de somnolence subjective : ${consultationData.sleepinessScale}/10.`);

    let overallRiskScore = 0;
    if (questionnaireScores.epworth !== undefined) {
        const interp = QUESTIONNAIRES.epworth.interpretation!(questionnaireScores.epworth);
        summary.push(`Score d'Epworth : ${questionnaireScores.epworth} (${interp.details ? interp.details.join(' ') : ''}).`);
        if (questionnaireScores.epworth > 10) overallRiskScore += 2; else if (questionnaireScores.epworth > 8) overallRiskScore +=1;
    }
    if (questionnaireScores.stopBang !== undefined) {
        const interp = QUESTIONNAIRES.stopBang.interpretation!(questionnaireScores.stopBang, consultationData, patientDemographics);
        summary.push(`Score STOP-BANG : ${questionnaireScores.stopBang} (${interp.details ? interp.details.join(' ') : ''}).`);
        if (questionnaireScores.stopBang >= 5) overallRiskScore += 3; else if (questionnaireScores.stopBang >= 3) overallRiskScore += 2;
    }
     if (questionnaireScores.berlin !== undefined) {
        const interp = QUESTIONNAIRES.berlin.interpretation!(questionnaireScores.berlin);
        summary.push(`Score de Berlin (simplifié) : ${questionnaireScores.berlin} (${interp.details ? interp.details.join(' ') : ''}).`);
        // Berlin score can also contribute to overallRiskScore if desired, e.g.,
        // if (questionnaireScores.berlin >= 2) overallRiskScore +=1; // Example adjustment
    }
     if (questionnaireScores.fosq10 !== undefined) {
        const interp = QUESTIONNAIRES.fosq10.interpretation!(questionnaireScores.fosq10);
        summary.push(`Score FOSQ-10 : ${questionnaireScores.fosq10} (${interp.details ? interp.details.join(' ') : ''}).`);
    }


    if (overallRiskScore >= 5) { // High risk based on questionnaires (e.g. STOP-BANG >=5 or Epworth >10 + STOP-BANG 3-4)
        riskLevel = 'Élevé';
        recommendations.push("Suspicion élevée de SAHOS. Consultation spécialisée et exploration du sommeil (polygraphie/polysomnographie) fortement recommandées.");
    } else if (overallRiskScore >= 3) { // Moderate risk (e.g. STOP-BANG 3-4)
        riskLevel = 'Modéré';
        recommendations.push("Suspicion modérée de SAHOS. Évaluation médicale approfondie et exploration du sommeil suggérées.");
    } else { // Low risk
        riskLevel = 'Faible';
        recommendations.push("Suspicion plus faible de SAHOS. Maintenir bonne hygiène de sommeil. Réévaluer si symptômes s'aggravent ou persistent.");
    }
    
    if (bmi >= 25) {
      recommendations.push("La gestion du poids est conseillée (IMC actuel: " + bmi.toFixed(1) + " kg/m²).");
    }
    if (consultationData.smoking === 'actuel') {
      recommendations.push("L'arrêt du tabac est fortement recommandé.");
    }
    if (parseFloat(consultationData.alcohol) > 7 && patientDemographics.gender === 'F' || parseFloat(consultationData.alcohol) > 14 && patientDemographics.gender === 'M') {
      recommendations.push("La modération de la consommation d'alcool est conseillée.");
    }

    // Removed nextAppointmentDate logic from recommendations
    recommendations.push("Planifier un suivi si nécessaire, en fonction des symptômes et du niveau de suspicion.");


    setTimeout(() => {
      const newConclusion: AppConclusion = { summary, recommendations, riskLevel };
      setAppConclusion(newConclusion);
      markStepCompleted(5 as StepId);
      setIsGeneratingConclusion(false);
      saveCurrentSession(); 
      alert("Conclusion générée et rapport sauvegardé localement !");
    }, 500);
  };
  
  const resetSession = useCallback((confirm = true) => {
    const doReset = confirm ? window.confirm('Êtes-vous sûr de vouloir créer un nouveau rapport ? Toutes les données actuelles non enregistrées seront perdues.') : true;
    if (doReset) {
        setPatientDemographics(INITIAL_PATIENT_DEMOGRAPHICS);
        setConsultationData(INITIAL_CONSULTATION_DATA);
        setQuestionnaireScores({});
        setAppConclusion(null);
        setCurrentStep(1);
        setCompletedSteps([]);
        setIsGeneratingConclusion(false);
        try {
          localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        } catch (error) {
          console.error("Failed to remove session from localStorage:", error);
        }
    }
  }, []);


  const combinedFormDataForSteps = useMemo(() => {
    return { ...patientDemographics, ...consultationData } as CombinedFormData;
  }, [patientDemographics, consultationData]);


  const renderStepContent = () => {
    const reportSessionForStep5: ReportSession | null = {
        data: consultationData,
        questionnaireScores: questionnaireScores,
        appConclusion: appConclusion,
        completedSteps: completedSteps
    };

    switch (currentStep) {
      case 1: return <Step1Demographics 
                        patientDemographics={patientDemographics} 
                        consultationData={consultationData}
                        handleChange={handleInputChange} 
                        nextStep={nextStep} 
                      />;
      case 2: return <Step2History combinedFormData={combinedFormDataForSteps} handleChange={handleInputChange} nextStep={nextStep} previousStep={previousStep} />;
      case 3: return <Step3Clinical 
                        combinedFormData={combinedFormDataForSteps} 
                        handleChange={handleInputChange} 
                        nextStep={nextStep} 
                        previousStep={previousStep} 
                      />;
      case 4: return <Step4Questionnaires scores={questionnaireScores} openQuestionnaire={openQuestionnaire} nextStep={nextStep} previousStep={previousStep} />;
      case 5: return <Step5Conclusion 
                        consultation={reportSessionForStep5} 
                        generateConclusion={generateConclusion} 
                        isGenerating={isGeneratingConclusion} 
                        previousStep={previousStep} 
                        resetForm={() => resetSession()} 
                        // handleChange prop removed
                      />;
      default: return ( 
         <div className="text-center p-5">
            <p className={`text-lg text-[${TEXT_SECONDARY}]`}>Chargement de l'application...</p>
            <button onClick={() => resetSession(false)} className={`mt-4 px-5 py-2.5 bg-[${PRIMARY_BLUE}] text-white rounded-lg`}>Commencer un Nouveau Rapport</button>
          </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col">
      <TopNavbar 
        className="print-hidden"
        onNewReport={() => resetSession()}
      />
      <ProgressNavbar className="print-hidden" currentStep={currentStep} completedSteps={completedSteps} goToStep={goToStep} steps={STEPS} />
      <main className="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        {renderStepContent()}
      </main>
      {activeQuestionnaire && QUESTIONNAIRES[activeQuestionnaire] && (
        <QuestionnaireModal
          questionnaire={QUESTIONNAIRES[activeQuestionnaire]}
          consultationData={consultationData} 
          patientDemographics={patientDemographics} 
          onClose={closeQuestionnaire}
          onSubmit={submitQuestionnaireScore}
        />
      )}
      <footer className={`py-6 text-center text-sm text-[${TEXT_SECONDARY}] bg-white border-t border-[#E5E7EB] print-hidden`}>
        <p>&copy; {new Date().getFullYear()} SAHOS Diagnostic Tool. Tous droits réservés.</p>
        <p>Cette application est développée par Dr Zouhair Souissi.</p>
      </footer>
    </div>
  );
};

export default App;
