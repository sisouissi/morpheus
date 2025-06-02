
import React, { ChangeEvent } from 'react';
import { PatientDemographics, ConsultationData } from '../../types.ts';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { Button } from '../ui/Button.tsx';
import { SectionWrapper } from '../SectionWrapper.tsx';
import { STEPS } from '../../constants.ts';

interface Step1Props {
  patientDemographics: PatientDemographics;
  consultationData: ConsultationData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  nextStep: () => void;
}

export const Step1Demographics: React.FC<Step1Props> = ({ patientDemographics, consultationData, handleChange, nextStep }) => {
  const currentStepConfig = STEPS.find(s => s.id === 1);
  if (!currentStepConfig) return null;

  return (
    <SectionWrapper stepConfig={currentStepConfig}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <Input label="Nom" name="lastname" value={patientDemographics.lastname} onChange={handleChange} placeholder="Nom de famille" required />
        <Input label="Prénom" name="firstname" value={patientDemographics.firstname} onChange={handleChange} placeholder="Prénom" required />
        <Input label="Date de naissance" name="birthdate" type="date" value={patientDemographics.birthdate} onChange={handleChange} required />
        <Select
          label="Sexe"
          name="gender"
          value={patientDemographics.gender}
          onChange={handleChange}
          options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]}
          placeholder="Sélectionner"
          required
        />
        <Input label="Profession" name="profession" value={patientDemographics.profession} onChange={handleChange} placeholder="Profession du patient" />
        <Input label="Date du Rapport" name="consultationDate" type="date" value={consultationData.consultationDate} onChange={handleChange} required />
        
        <Input label="Taille (cm)" name="height" type="number" value={consultationData.height} onChange={handleChange} placeholder="170" min="100" max="250" />
        <Input label="Poids (kg)" name="weight" type="number" value={consultationData.weight} onChange={handleChange} placeholder="70" min="30" max="300" />
        <Input label="Tour de cou (cm)" name="neckCircumference" type="number" value={consultationData.neckCircumference} onChange={handleChange} placeholder="40" min="25" max="60" />
      </div>
      <div className="mt-10 flex justify-end">
        <Button onClick={nextStep}>Suivant →</Button>
      </div>
    </SectionWrapper>
  );
};