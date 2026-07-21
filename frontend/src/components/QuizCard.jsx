import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { Input } from './ui/input';
import { CheckCircle2, Circle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function QuizCard({ question, index, selectedAnswer, onAnswerChange, isEvaluated }) {
  const isMCQ = question.type === 'mcq' || question.type === 'true_false';

  const isAnswerCorrect = () => {
    return selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  };

  return (
    <Card className={cn("mb-6 overflow-hidden border-2 shadow-sm transition-all duration-300", 
      isEvaluated && isAnswerCorrect() ? "border-green-400" : 
      isEvaluated && !isAnswerCorrect() ? "border-red-400" : "border-border bg-card text-card-foreground"
    )}>
      <CardHeader className={cn("pb-4 border-b",
        isEvaluated && isAnswerCorrect() ? "bg-green-50/50" :
        isEvaluated && !isAnswerCorrect() ? "bg-red-50/50" : "bg-muted/20"
      )}>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-medium leading-tight">
            <span className="text-muted-foreground mr-2">{index + 1}.</span>
            {question.question}
          </CardTitle>
          <div className="flex gap-2 shrink-0">
            <Badge variant="outline" className="uppercase text-[10px] bg-background">
              {question.type.replace('_', ' ')}
            </Badge>
            <Badge 
              variant={question.difficulty === 'hard' ? 'destructive' : question.difficulty === 'easy' ? 'secondary' : 'default'} 
              className="capitalize text-[10px]"
            >
              {question.difficulty || 'medium'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isMCQ ? (
          <div className="space-y-3">
            {question.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isActualCorrect = option === question.correctAnswer;
              
              let stateClass = "border-input bg-card hover:bg-muted/50 cursor-pointer";
              let icon = <Circle className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary" />;
              let textClass = "text-foreground";
              
              if (isEvaluated) {
                // Default for unselected, wrong options: fully readable, but visually neutral
                stateClass = "border-border bg-muted/10 cursor-default"; 
                icon = <Circle className="h-5 w-5 text-muted-foreground/40" />;
                textClass = "text-foreground"; 
                
                if (isActualCorrect) {
                  // High contrast for the correct answer
                  stateClass = "bg-green-100 border-green-500 cursor-default ring-1 ring-green-500 shadow-sm";
                  icon = <CheckCircle2 className="h-5 w-5 text-green-700" />;
                  textClass = "font-bold text-green-900";
                } else if (isSelected && !isActualCorrect) {
                  // High contrast for the wrong selected answer
                  stateClass = "bg-red-100 border-red-500 cursor-default ring-1 ring-red-500 shadow-sm";
                  icon = <XCircle className="h-5 w-5 text-red-700" />;
                  textClass = "font-bold text-red-900";
                }
              } else if (isSelected) {
                // Highlight when selected before evaluation
                stateClass = "border-primary bg-primary/10 ring-1 ring-primary cursor-pointer shadow-sm";
                icon = <CheckCircle2 className="h-5 w-5 text-primary" />;
                textClass = "font-semibold text-primary";
              }

              return (
                <div 
                  key={idx} 
                  onClick={() => !isEvaluated && onAnswerChange(option)}
                  className={cn("group flex items-start p-4 rounded-lg border transition-all", stateClass)}
                >
                  <div className="mt-0.5 mr-3 shrink-0">
                    {icon}
                  </div>
                  <div className={cn("text-base leading-relaxed", textClass)}>
                    {option}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Your Answer:</label>
              <Input 
                value={selectedAnswer}
                onChange={(e) => !isEvaluated && onAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isEvaluated}
                className={cn(
                  "text-base py-6", // Make input bigger and more readable
                  isEvaluated && isAnswerCorrect() ? "border-green-500 bg-green-50 text-green-900 font-medium opacity-100 disabled:opacity-100" : "",
                  isEvaluated && !isAnswerCorrect() ? "border-red-500 bg-red-50 text-red-900 font-medium opacity-100 disabled:opacity-100" : ""
                )}
              />
            </div>
            
            {isEvaluated && (
              <div className={cn(
                "p-5 rounded-lg border flex gap-3 items-start shadow-sm",
                isAnswerCorrect() ? "bg-green-100 border-green-300 text-green-900" : "bg-red-100 border-red-300 text-red-900"
              )}>
                <div className="shrink-0 mt-0.5">
                  {isAnswerCorrect() ? <CheckCircle2 className="w-6 h-6 text-green-700" /> : <XCircle className="w-6 h-6 text-red-700" />}
                </div>
                <div>
                  <div className="font-bold text-lg mb-1">
                    {isAnswerCorrect() ? "Correct!" : "Incorrect"}
                  </div>
                  {!isAnswerCorrect() && (
                    <div className="text-base mt-2">
                      <span className="font-semibold block mb-1">The correct answer is: </span>
                      <span className="bg-background px-3 py-1.5 rounded border border-red-200 inline-block font-medium">
                        {question.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {question.explanation && isEvaluated && (
        <CardFooter className="pt-0 bg-muted/20 border-t mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation" className="border-b-0">
              <AccordionTrigger className="text-base py-4 hover:no-underline flex items-center justify-start gap-2 font-semibold">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="flex-1 text-left text-foreground">View Explanation & RAG Citation</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-foreground leading-relaxed pl-8 pb-4 space-y-3">
                <p>{question.explanation}</p>
                {question.sourceSnippet && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-primary font-bold">
                      <span>🎯 Verified Context Evidence</span>
                      <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded uppercase">{question.contextRef || 'RAG Grounded'}</span>
                    </div>
                    <p className="font-mono text-muted-foreground italic">"{question.sourceSnippet}"</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      )}
    </Card>
  );
}
