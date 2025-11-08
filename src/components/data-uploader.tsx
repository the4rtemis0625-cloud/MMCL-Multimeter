'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, TestTube2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Reading } from '@/types';

interface DataUploaderProps {
  onDataLoaded: (data: Reading[]) => void;
  generateData: () => Reading[];
}

export default function DataUploader({ onDataLoaded, generateData }: DataUploaderProps) {
  const [isProcessing, startProcessingTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
      startProcessingTransition(() => {
        // Simulate processing a real file
        setTimeout(() => {
          const mockData = generateData();
          onDataLoaded(mockData);
        }, 1000);
      });
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };
  
  const handleGenerateData = () => {
    startGeneratingTransition(() => {
      setTimeout(() => {
        const mockData = generateData();
        onDataLoaded(mockData);
        setFileName('mock_data.csv'); // Give some feedback
      }, 1000);
    });
  };

  const isBusy = isProcessing || isGenerating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Data</CardTitle>
        <CardDescription>Upload a data file or use sample data to get started.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow w-full sm:w-auto">
          <Label 
            htmlFor="data-file" 
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto",
              isBusy ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isProcessing ? 'Processing...' : 'Upload File'}
          </Label>
          <Input id="data-file" type="file" onChange={handleFileChange} className="sr-only" disabled={isBusy} />
          {fileName && <p className="text-sm text-muted-foreground mt-2">Loaded: {fileName}</p>}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-grow h-px bg-border"></div>
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-grow h-px bg-border"></div>
        </div>

        <Button variant="outline" onClick={handleGenerateData} disabled={isBusy} className="w-full sm:w-auto">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
          {isGenerating ? 'Generating...' : 'Generate Sample Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
