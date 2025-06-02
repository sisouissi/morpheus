
import { Questionnaire, Step, PatientDemographics, ConsultationData, QuestionnaireType, CombinedFormData } from './types.ts';

export const INITIAL_PATIENT_DEMOGRAPHICS: PatientDemographics = {
  lastname: '',
  firstname: '',
  birthdate: '',
  gender: '',
  profession: '',
};

export const INITIAL_CONSULTATION_DATA: ConsultationData = {
  height: '',
  weight: '',
  neckCircumference: '',
  antecedents: {
    hta: false,
    diabete: false,
    cardiopathie: false,
    avc: false,
    depression: false,
    hypothyroidie: false,
  },
  familyHistorySahos: false,
  nasalObstruction: false,
  gerd: false,
  currentTreatments: '',
  smoking: '',
  alcohol: '',
  symptoms: {
    ronflements: false,
    apnees: false,
    somnolence: false,
    fatigue: false,
    cephalees: false,
    nycturie: false,
    troublesConcentration: false,
  },
  morningDryMouth: false,
  nocturnalChokingGasping: false,
  mallampatiScore: '',
  tonsilSize: '',
  
  motivationSomnolence: false,
  motivationRonflements: false,
  motivationApneesEntourage: false,
  motivationBilanPreOp: false,
  motivationFatigueChronique: false,
  motivationHTAResistante: false,
  explorationReasonOther: '',

  sleepinessScale: 5,
  consultationDate: new Date().toISOString().split('T')[0], 
  // nextAppointmentDate: '', // Removed
};


const calculateAge = (birthdate: string): number => {
  if (!birthdate) return 0;
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateBMI = (heightStr: string, weightStr: string): number => {
    const height = parseFloat(heightStr);
    const weight = parseFloat(weightStr);
    if (!height || !weight || height <=0 || weight <=0) return 0;
    return weight / ((height / 100) ** 2);
};


export const QUESTIONNAIRES: Record<QuestionnaireType, Questionnaire> = {
  epworth: {
    id: 'epworth',
    title: "Échelle de Somnolence d'Epworth",
    icon: '😴',
    iconBgGradient: 'bg-[linear-gradient(135deg,#3B82F6,#1D4ED8)]',
    description: "Évaluez votre risque de vous assoupir dans différentes situations.",
    questions: [
      { id: 'ep_q1', text: "Assis en train de lire", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q2', text: "En train de regarder la télévision", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q3', text: "Assis, inactif dans un lieu public (cinéma, théâtre, réunion)", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q4', text: "Comme passager d’une voiture (ou transport en commun) roulant sans arrêt pendant une heure", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q5', text: "Allongé l’après-midi lorsque les circonstances le permettent", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q6', text: "Étant assis en parlant avec quelqu’un", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q7', text: "Assis au calme après un déjeuner sans alcool", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
      { id: 'ep_q8', text: "Dans une voiture immobilisée depuis quelques minutes (embouteillage, feu rouge…)", options: [{ value: 0, text: "Aucune chance" },{ value: 1, text: "Faible chance" },{ value: 2, text: "Chance moyenne" },{ value: 3, text: "Forte chance" }] },
    ],
    interpretation: (score) => {
      if (score <= 8) return { text: "Score d'Epworth : " + score, details: ["Somnolence diurne normale ou peu probable."] };
      if (score >= 9 && score <= 10) return { text: "Score d'Epworth : " + score, details: ["Somnolence diurne légère. Peut être normale pour certains individus."] };
      if (score >= 11 && score <= 15) return { text: "Score d'Epworth : " + score, details: ["Somnolence diurne modérée. Un avis médical peut être utile."] };
      return { text: "Score d'Epworth : " + score, details: ["Somnolence diurne sévère. Consultation médicale recommandée."] };
    }
  },
  berlin: {
    id: 'berlin',
    title: "Questionnaire de Berlin (Simplifié)",
    icon: '🏥',
    iconBgGradient: 'bg-[linear-gradient(135deg,#F59E0B,#D97706)]',
    description: "Dépistage du risque d'apnée du sommeil (version simplifiée).",
    questions: [
      { id: 'b_q1', text: "Ronflez-vous ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'b_q2', text: "Votre ronflement est-il fort (plus fort que la parole ou audible à travers une porte) ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'b_q3', text: "A-t-on déjà remarqué que vous arrêtiez de respirer pendant votre sommeil ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'b_q4', text: "Vous sentez-vous fatigué ou las après votre sommeil, ou durant la journée ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'b_q5', text: "Avez-vous une hypertension artérielle ou êtes-vous traité pour cela ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
    ],
    interpretation: (score) => {
      if (score <= 1) return { text: "Score de Berlin (simplifié) : " + score, details: ["Risque faible d'apnée du sommeil selon ce questionnaire simplifié."] };
      if (score <= 3) return { text: "Score de Berlin (simplifié) : " + score, details: ["Risque modéré d'apnée du sommeil."] };
      return { text: "Score de Berlin (simplifié) : " + score, details: ["Risque élevé d'apnée du sommeil. Consultation recommandée."] };
    }
  },
  stopBang: {
    id: 'stopBang',
    title: "Questionnaire STOP-BANG",
    icon: '⚠️',
    iconBgGradient: 'bg-[linear-gradient(135deg,#EF4444,#DC2626)]',
    description: "Outil de dépistage pour identifier les patients à risque de SAHOS.",
    questions: [
      { id: 's', text: "S (Snoring) - Ronflez-vous bruyamment (plus fort que la parole, ou entendu à travers une cloison) ou de manière gênante ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 't', text: "T (Tiredness) - Vous sentez-vous souvent fatigué, las ou somnolent durant la journée ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'o', text: "O (Observed apnea) - Vous a-t-on fait remarquer que vous arrêtiez de respirer pendant votre sommeil ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'p', text: "P (Blood Pressure) - Êtes-vous hypertendu ou prenez-vous un traitement pour la tension ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }] },
      { id: 'b', text: "B (BMI) - Votre Indice de Masse Corporelle (IMC) est-il supérieur à 35 kg/m² ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }],
        condition: (consultationData, patientDemographics) => `IMC calculé : ${calculateBMI(consultationData.height, consultationData.weight).toFixed(1)} kg/m²`
      },
      { id: 'a', text: "A (Age) - Avez-vous plus de 50 ans ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }],
        condition: (consultationData, patientDemographics) => `Âge calculé : ${patientDemographics ? calculateAge(patientDemographics.birthdate) : 'N/A'} ans`
      },
      { id: 'n', text: "N (Neck Circumference) - Votre tour de cou est-il supérieur à 43 cm (homme) ou 41 cm (femme) ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }],
        condition: (consultationData, patientDemographics) => `Tour de cou : ${consultationData.neckCircumference} cm, Sexe : ${patientDemographics?.gender === "M" ? "Homme" : patientDemographics?.gender === "F" ? "Femme" : "Non spécifié"}`
      },
      { id: 'g', text: "G (Gender) - Êtes-vous de sexe masculin ?", options: [{ value: 0, text: "Non" },{ value: 1, text: "Oui" }],
        condition: (consultationData, patientDemographics) => `Sexe : ${patientDemographics?.gender === "M" ? "Homme" : patientDemographics?.gender === "F" ? "Femme" : "Non spécifié"}`
      },
    ],
    interpretation: (score) => {
      if (score <= 2) return { text: "Score STOP-BANG : " + score, details: ["Probabilité de SAOS faible."] };
      if (score >= 3 && score <= 4) return { text: "Score STOP-BANG : " + score, details: ["Probabilité de SAOS modérée."] };
      return { text: "Score STOP-BANG : " + score, details: ["Probabilité de SAOS élevée. Consultation spécialisée fortement recommandée."] };
    }
  },
  fosq10: {
    id: 'fosq10',
    title: "FOSQ-10",
    icon: '🏃',
    iconBgGradient: 'bg-[linear-gradient(135deg,#10B981,#059669)]',
    description: "Questionnaire sur les conséquences fonctionnelles du sommeil (version réduite).",
    questions: [
        { id: 'fosq_q1', text: "Avez-vous des difficultés à vous concentrer sur ce que vous faites parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q2', text: "Avez-vous généralement des difficultés à vous souvenir des choses parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q3', text: "Avez-vous des difficultés à finir un repas parce que vous devenez somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q4', text: "Avez-vous des difficultés à travailler sur un hobby (par exemple, couture, collection, jardinage) parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q5', text: "Avez-vous des difficultés à faire des travaux ménagers (par exemple, nettoyer la maison, faire la lessive, sortir les poubelles, faire des réparations) parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q6', text: "Avez-vous des difficultés à conduire un véhicule motorisé sur de courtes distances (moins de 160 km) parce que vous devenez somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q7', text: "Avez-vous des difficultés à conduire un véhicule motorisé sur de longues distances (plus de 160 km) parce que vous devenez somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q8', text: "Avez-vous des difficultés à faire avancer les choses parce que vous êtes trop somnolent ou fatigué pour conduire ou prendre les transports en commun ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q9', text: "Avez-vous des difficultés à gérer vos affaires financières et à faire de la paperasserie (par exemple, faire des chèques, payer des factures, tenir des registres financiers, remplir des formulaires fiscaux, etc.) parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
        { id: 'fosq_q10', text: "Avez-vous des difficultés à effectuer un travail rémunéré ou bénévole parce que vous êtes somnolent ou fatigué ?", options: [{ value: 4, text: "Non, aucune difficulté" }, { value: 3, text: "Oui, un peu de difficulté" }, { value: 2, text: "Oui, modérément de difficulté" }, { value: 1, text: "Oui, extrêmement de difficulté" }] },
    ],
    interpretation: (score) => {
        let detail = "Un score plus élevé indique un meilleur fonctionnement quotidien lié au sommeil.";
        if (score < 20) detail = "Impact significatif de la somnolence/fatigue sur le fonctionnement quotidien.";
        else if (score < 30) detail = "Impact modéré de la somnolence/fatigue sur le fonctionnement quotidien.";
        else detail = "Peu ou pas d'impact de la somnolence/fatigue sur le fonctionnement quotidien.";
      return { text: "Score FOSQ-10 : " + score + " / 40", details: [detail] };
    }
  }
};


export const STEPS: Step[] = [
  { id: 1, name: "Identité & Mesures", icon: "👤", iconBgGradient: "bg-[linear-gradient(135deg,#3B82F6,#1D4ED8)]", title: "Identité et Mesures Initiales", description: "Informations patient, mesures anthropométriques et date du rapport" },
  { id: 2, name: "Antécédents", icon: "📋", iconBgGradient: "bg-[linear-gradient(135deg,#F59E0B,#D97706)]", title: "Antécédents et Habitudes", description: "Historique médical, traitements et habitudes de vie" },
  { id: 3, name: "Clinique", icon: "🩺", iconBgGradient: "bg-[linear-gradient(135deg,#EF4444,#DC2626)]", title: "Données Cliniques", description: "Symptômes et examen clinique général" },
  { id: 4, name: "Questionnaires", icon: "📝", iconBgGradient: "bg-[linear-gradient(135deg,#10B981,#059669)]", title: "Questionnaires d'Évaluation", description: "Scores standardisés pour l'évaluation du SAHOS" },
  { id: 5, name: "Conclusion", icon: "💡", iconBgGradient: "bg-[linear-gradient(135deg,#043873,#4F9CF9)]", title: "Conclusion et Propositions", description: "Synthèse du rapport, suspicion diagnostique et propositions" }
];

export const PRIMARY_BLUE = "#4F9CF9";
export const SECONDARY_BLUE = "#043873";
export const LIGHT_BLUE = "#F7F9FF";
export const TEXT_PRIMARY = "#212529";
export const TEXT_SECONDARY = "#6C757D";
export const GREEN_SUCCESS = "#10B981";
export const YELLOW_ACCENT = "#FFE492";
export const BORDER_LIGHT = "#E5E7EB";