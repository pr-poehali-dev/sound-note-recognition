import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import GuitarFretboard from './GuitarFretboard';

interface DetectedNote {
  note: string;
  frequency: number;
  string: number;
  fret: number;
}

const RecordTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedNotes, setDetectedNotes] = useState<DetectedNote[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const visualize = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += Math.abs(dataArray[i] - 128);
        }
        const average = sum / dataArray.length;
        setAudioLevel(average / 128 * 100);
        
        animationFrameRef.current = requestAnimationFrame(visualize);
      };
      
      visualize();
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      setTimeout(() => {
        stopRecording();
        simulateNoteDetection();
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsRecording(false);
    setAudioLevel(0);
  };

  const simulateNoteDetection = () => {
    const notes: DetectedNote[] = [
      { note: 'E', frequency: 82.41, string: 6, fret: 0 },
      { note: 'A', frequency: 110.00, string: 5, fret: 0 },
      { note: 'D', frequency: 146.83, string: 4, fret: 0 },
    ];
    setDetectedNotes(notes);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Запись аудио</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full w-24 h-24 ${isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
            >
              <Icon name={isRecording ? 'Square' : 'Mic'} size={40} />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Идет запись...' : 'Нажмите для записи'}
            </p>

            {isRecording && (
              <div className="w-full max-w-md">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {detectedNotes.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Распознанные ноты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detectedNotes.map((note, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-semibold text-lg">{note.note}</p>
                      <p className="text-sm text-muted-foreground">{note.frequency.toFixed(2)} Hz</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{note.string}-я струна</p>
                      <p className="text-sm text-muted-foreground">{note.fret} лад</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Гриф гитары</CardTitle>
            </CardHeader>
            <CardContent>
              <GuitarFretboard highlightedNotes={detectedNotes} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RecordTab;
