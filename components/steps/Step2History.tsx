
import React, { ChangeEvent } from 'react';
import { CombinedFormData, ConsultationData } from '../../types.ts'; // Use CombinedFormData
import { Checkbox } from '../ui/Checkbox.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { Button } from '../ui/Button.tsx';
import { SectionWrapper } from '../SectionWrapper.tsx';
import { STEPS, TEXT_PRIMARY } from '../../constants.ts';

interface Step2Props {
  combinedFormData: CombinedFormData; // Changed from FormData
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const Step2History: React.FC<Step2Props> = ({ combinedFormData, handleChange, nextStep, previousStep }) => {
  const currentStepConfig = STEPS.find(s => s.id === 2);
  if (!currentStepConfig) return null;

  const antecedentsOptions = [
    { name: 'hta', label: 'Hypertension artérielle' },
    { name: 'diabete', label: 'Diabète' },
    { name: 'cardiopathie', label: 'Cardiopathie' },
    { name: 'avc', label: 'Accident vasculaire cérébral' },
    { name: 'depression', label: 'Dépression' },
    { name: 'hypothyroidie', label: 'Hypothyroïdie' },
  ];

  const otherHistoryOptions = [
    { name: 'familyHistorySahos', label: 'Antécédents familiaux de SAHOS connu', dataCategory: 'root' },
    { name: 'nasalObstruction', label: 'Obstruction nasale chronique / Allergies sévères', dataCategory: 'root' },
    { name: 'gerd', label: 'Reflux Gastro-Œsophagien (RGO)', dataCategory: 'root' },
  ];

  return (
    <SectionWrapper stepConfig={currentStepConfig}>
      <div className="space-y-8">
        <div>
          <label className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-3 uppercase tracking-wider`}>Antécédents médicaux personnels</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {antecedentsOptions.map(opt => (
              <Checkbox
                key={opt.name}
                label={opt.label}
                name={opt.name}
                dataCategory="antecedents" // This targets combinedFormData.antecedents
                checked={combinedFormData.antecedents[opt.name as keyof ConsultationData['antecedents']]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mt-6 mb-3 uppercase tracking-wider`}>Autres antécédents pertinents</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherHistoryOptions.map(opt => (
              <Checkbox
                key={opt.name}
                label={opt.label}
                name={opt.name}
                dataCategory={opt.dataCategory} // 'root' for direct properties of ConsultationData
                checked={combinedFormData[opt.name as keyof Pick<ConsultationData, 'familyHistorySahos' | 'nasalObstruction' | 'gerd'>]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        <Textarea
          label="Traitements actuels"
          name="currentTreatments"
          value={combinedFormData.currentTreatments}
          onChange={handleChange}
          placeholder="Liste des médicaments et traitements en cours..."
          rows={4}
        />

        <div>
          <label className={`block text-sm font-semibold text-[${TEXT_PRIMARY}] mb-3 uppercase tracking-wider`}>Consommation</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <Select
              label="Tabac"
              name="smoking"
              value={combinedFormData.smoking}
              onChange={handleChange}
              options={[
                { value: 'non', label: 'Non fumeur' },
                { value: 'actuel', label: 'Fumeur actuel' },
                { value: 'ancien', label: 'Ancien fumeur' },
              ]}
              placeholder="Sélectionner"
            />
            <Input
              label="Alcool (verres/semaine)"
              name="alcohol"
              type="number"
              value={combinedFormData.alcohol}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <Button variant="secondary" onClick={previousStep}>← Précédent</Button>
        <Button onClick={nextStep}>Suivant →</Button>
      </div>
    </SectionWrapper>
  );
};