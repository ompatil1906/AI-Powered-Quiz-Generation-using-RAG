import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const QUESTION_TYPES = [
  { id: 'mcq', label: 'Multiple Choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'fill_blank', label: 'Fill in the Blank' },
  { id: 'short_answer', label: 'Short Answer' },
];

export function ConfigurationPanel({ config, setConfig, onGenerate, isGenerating, isIngested }) {
  const handleTypeToggle = (typeId) => {
    setConfig(prev => {
      const types = prev.questionTypes.includes(typeId)
        ? prev.questionTypes.filter(t => t !== typeId)
        : [...prev.questionTypes, typeId];
      return { ...prev, questionTypes: types };
    });
  };

  return (
    <Card className="h-full flex flex-col border-r shadow-none rounded-none md:border-r-0 lg:border-r">
      <CardHeader>
        <CardTitle>Quiz Settings</CardTitle>
        <CardDescription>Configure your assessment parameters.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="questionCount">Number of Questions ({config.questionCount})</Label>
          <input
            id="questionCount"
            type="range"
            min="1"
            max="20"
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            id="difficulty"
            value={config.difficulty}
            onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Question Types</Label>
          <div className="grid grid-cols-2 gap-3">
            {QUESTION_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={config.questionTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                />
                <Label
                  htmlFor={`type-${type.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloom">Bloom's Taxonomy (Optional)</Label>
          <Select
            id="bloom"
            value={config.bloomTaxonomy}
            onChange={(e) => setConfig({ ...config, bloomTaxonomy: e.target.value })}
          >
            <option value="Remembering">Remembering</option>
            <option value="Understanding">Understanding</option>
            <option value="Applying">Applying</option>
            <option value="Analyzing">Analyzing</option>
            <option value="Evaluating">Evaluating</option>
            <option value="Creating">Creating</option>
          </Select>
        </div>

        <div className="mt-auto pt-6">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={onGenerate} 
            disabled={isGenerating || !isIngested}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
