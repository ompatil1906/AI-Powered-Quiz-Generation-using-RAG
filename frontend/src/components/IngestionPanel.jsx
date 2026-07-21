import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export function IngestionPanel({ transcript, setTranscript, lessonId, setLessonId, onIngest, isIngesting }) {
  return (
    <Card className="h-full flex flex-col shadow-none border-0 rounded-none bg-muted/20">
      <CardHeader>
        <CardTitle>Source Content</CardTitle>
        <CardDescription>Paste your lesson transcript to build the knowledge base.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="lessonId">Lesson ID</Label>
          <Input 
            id="lessonId" 
            placeholder="e.g. lesson-1" 
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="transcript">Transcript content</Label>
          <Textarea
            id="transcript"
            placeholder="Paste your lesson transcript, article, or document text here..."
            className="flex-1 resize-none font-mono text-sm"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onIngest}
            disabled={isIngesting || !transcript.trim() || !lessonId.trim()}
          >
            {isIngesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Transcript
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
