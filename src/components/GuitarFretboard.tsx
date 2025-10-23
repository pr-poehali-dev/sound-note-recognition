interface DetectedNote {
  note: string;
  string: number;
  fret: number;
}

interface GuitarFretboardProps {
  highlightedNotes: DetectedNote[];
}

const GuitarFretboard = ({ highlightedNotes }: GuitarFretboardProps) => {
  const strings = 6;
  const frets = 12;
  const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];

  const isHighlighted = (stringNum: number, fretNum: number) => {
    return highlightedNotes.some(note => note.string === stringNum && note.fret === fretNum);
  };

  const getNoteName = (stringNum: number, fretNum: number) => {
    const note = highlightedNotes.find(n => n.string === stringNum && n.fret === fretNum);
    return note?.note;
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          <div className="flex flex-col justify-around py-4 pr-2">
            {Array.from({ length: strings }).map((_, idx) => (
              <div key={idx} className="text-xs font-medium text-muted-foreground h-8 flex items-center">
                {stringNames[idx]}
              </div>
            ))}
          </div>

          {Array.from({ length: frets + 1 }).map((_, fretIdx) => (
            <div key={fretIdx} className="flex flex-col gap-0 relative">
              {fretIdx > 0 && (
                <div className="absolute -left-0.5 top-0 bottom-0 w-1 bg-border" />
              )}
              
              <div className="flex flex-col justify-around py-4">
                {Array.from({ length: strings }).map((_, stringIdx) => {
                  const stringNum = stringIdx + 1;
                  const highlighted = isHighlighted(stringNum, fretIdx);
                  const noteName = getNoteName(stringNum, fretIdx);
                  
                  return (
                    <div key={stringIdx} className="relative h-8 w-16 flex items-center justify-center">
                      <div className={`absolute inset-x-0 h-0.5 bg-foreground/20`} 
                           style={{ 
                             height: `${0.5 + stringIdx * 0.2}px` 
                           }} 
                      />
                      {highlighted && (
                        <div className="relative z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs animate-scale-in">
                          {noteName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {fretIdx > 0 && (
                <div className="text-center text-xs text-muted-foreground mt-1">
                  {fretIdx}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuitarFretboard;
