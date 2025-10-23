import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import GuitarFretboard from './GuitarFretboard';
import { AudioPitchDetector, DetectedNote as PitchNote } from '@/utils/pitchDetection';

interface DetectedNote {
  note: string;
  frequency: number;
  string: number;
  fret: number;
  clarity?: number;
}

const guitarStrings = [
  { note: 'E', frequency: 82.41, string: 6 },
  { note: 'A', frequency: 110.00, string: 5 },
  { note: 'D', frequency: 146.83, string: 4 },
  { note: 'G', frequency: 196.00, string: 3 },
  { note: 'B', frequency: 246.94, string: 2 },
  { note: 'E', frequency: 329.63, string: 1 },
];

function findFretPosition(note: string, frequency: number): { string: number; fret: number } | null {
  const noteSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  for (const guitarString of guitarStrings) {
    const openNoteIndex = noteSequence.indexOf(guitarString.note);
    const targetNoteIndex = noteSequence.indexOf(note);
    
    const fret = (targetNoteIndex - openNoteIndex + 12) % 12;
    
    const expectedFreq = guitarString.frequency * Math.pow(2, fret / 12);
    const freqDiff = Math.abs(frequency - expectedFreq);
    
    if (freqDiff < 10 && fret <= 12) {
      return { string: guitarString.string, fret };
    }
  }
  
  return null;
}

const RecordTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentNote, setCurrentNote] = useState<DetectedNote | null>(null);
  const [detectedNotes, setDetectedNotes] = useState<DetectedNote[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const pitchDetectorRef = useRef<AudioPitchDetector | null>(null);
  const lastNoteRef = useRef<string | null>(null);
  const noteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      pitchDetectorRef.current = new AudioPitchDetector();
      
      await pitchDetectorRef.current.start((pitchNote: PitchNote | null) => {
        if (pitchNote) {
          const position = findFretPosition(pitchNote.note, pitchNote.frequency);
          
          if (position) {
            const newNote: DetectedNote = {
              note: pitchNote.note,
              frequency: pitchNote.frequency,
              string: position.string,
              fret: position.fret,
              clarity: pitchNote.clarity
            };
            
            setCurrentNote(newNote);
            
            const noteKey = `${pitchNote.note}-${position.string}-${position.fret}`;
            if (lastNoteRef.current !== noteKey) {
              lastNoteRef.current = noteKey;
              
              if (noteTimeoutRef.current) {
                clearTimeout(noteTimeoutRef.current);
              }
              
              noteTimeoutRef.current = setTimeout(() => {
                setDetectedNotes(prev => {
                  const exists = prev.some(
                    n => n.note === newNote.note && n.string === newNote.string && n.fret === newNote.fret
                  );
                  if (!exists) {
                    return [...prev, newNote];
                  }
                  return prev;
                });
              }, 500);
            }
          }
        } else {
          setCurrentNote(null);
        }
      });
      
      setIsRecording(true);
      setDetectedNotes([]);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте настройки браузера.');
    }
  };

  const stopRecording = () => {
    if (pitchDetectorRef.current) {
      pitchDetectorRef.current.stop();
      pitchDetectorRef.current = null;
    }
    
    if (noteTimeoutRef.current) {
      clearTimeout(noteTimeoutRef.current);
      noteTimeoutRef.current = null;
    }
    
    setIsRecording(false);
    setCurrentNote(null);
    setAudioLevel(0);
    lastNoteRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (pitchDetectorRef.current) {
        pitchDetectorRef.current.stop();
      }
      if (noteTimeoutRef.current) {
        clearTimeout(noteTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && pitchDetectorRef.current) {
      const interval = setInterval(() => {
        const volume = pitchDetectorRef.current?.getVolume() || 0;
        setAudioLevel(volume * 100);
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isRecording]);

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
              <>
                <div className="w-full max-w-md">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                </div>
                
                {currentNote && (
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-3xl font-bold">{currentNote.note}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentNote.frequency.toFixed(1)} Hz • {currentNote.string} струна • {currentNote.fret} лад
                    </p>
                    {currentNote.clarity && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Точность: {Math.round(currentNote.clarity * 100)}%
                      </p>
                    )}
                  </div>
                )}
              </>
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