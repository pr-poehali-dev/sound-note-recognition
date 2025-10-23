import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChordShape {
  name: string;
  positions: { string: number; fret: number }[];
}

const ChordsTab = () => {
  const [selectedChord, setSelectedChord] = useState<ChordShape | null>(null);

  const chords: ChordShape[] = [
    {
      name: 'C Major',
      positions: [
        { string: 5, fret: 3 },
        { string: 4, fret: 2 },
        { string: 2, fret: 1 }
      ]
    },
    {
      name: 'G Major',
      positions: [
        { string: 6, fret: 3 },
        { string: 5, fret: 2 },
        { string: 1, fret: 3 }
      ]
    },
    {
      name: 'D Major',
      positions: [
        { string: 4, fret: 0 },
        { string: 3, fret: 2 },
        { string: 2, fret: 3 },
        { string: 1, fret: 2 }
      ]
    },
    {
      name: 'A Major',
      positions: [
        { string: 4, fret: 2 },
        { string: 3, fret: 2 },
        { string: 2, fret: 2 }
      ]
    },
    {
      name: 'E Major',
      positions: [
        { string: 5, fret: 2 },
        { string: 4, fret: 2 },
        { string: 3, fret: 1 }
      ]
    },
    {
      name: 'Am',
      positions: [
        { string: 4, fret: 2 },
        { string: 3, fret: 2 },
        { string: 2, fret: 1 }
      ]
    }
  ];

  const renderChordDiagram = (chord: ChordShape) => {
    const strings = 6;
    const frets = 5;

    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <h3 className="font-semibold text-lg mb-2">{chord.name}</h3>
        <div className="flex gap-1">
          {Array.from({ length: frets }).map((_, fretIdx) => (
            <div key={fretIdx} className="flex flex-col gap-0 relative">
              {fretIdx > 0 && (
                <div className="absolute -left-0.5 top-0 bottom-0 w-1 bg-border" />
              )}
              
              <div className="flex flex-col justify-around py-2">
                {Array.from({ length: strings }).map((_, stringIdx) => {
                  const stringNum = stringIdx + 1;
                  const position = chord.positions.find(
                    p => p.string === stringNum && p.fret === fretIdx
                  );
                  
                  return (
                    <div key={stringIdx} className="relative h-10 w-12 flex items-center justify-center">
                      <div className="absolute inset-x-0 h-0.5 bg-foreground/20" />
                      {position && (
                        <div className="relative z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center" />
                      )}
                    </div>
                  );
                })}
              </div>

              {fretIdx > 0 && (
                <div className="text-center text-xs text-muted-foreground">
                  {fretIdx}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="major" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="major">Мажорные</TabsTrigger>
          <TabsTrigger value="minor">Минорные</TabsTrigger>
          <TabsTrigger value="seventh">Септаккорды</TabsTrigger>
        </TabsList>

        <TabsContent value="major" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chords.filter(c => c.name.includes('Major')).map((chord) => (
              <Card 
                key={chord.name}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedChord(chord)}
              >
                <CardContent className="p-0">
                  {renderChordDiagram(chord)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="minor" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chords.filter(c => c.name.includes('m') && !c.name.includes('Major')).map((chord) => (
              <Card 
                key={chord.name}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedChord(chord)}
              >
                <CardContent className="p-0">
                  {renderChordDiagram(chord)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seventh" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Скоро</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Септаккорды и другие сложные аккорды появятся в следующей версии
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChordsTab;
