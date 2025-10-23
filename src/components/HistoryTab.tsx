import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HistoryRecord {
  id: number;
  date: string;
  notes: string[];
  duration: string;
}

const HistoryTab = () => {
  const historyRecords: HistoryRecord[] = [
    {
      id: 1,
      date: '23 октября 2024, 14:30',
      notes: ['E', 'A', 'D'],
      duration: '3 сек'
    },
    {
      id: 2,
      date: '23 октября 2024, 14:25',
      notes: ['G', 'C', 'E'],
      duration: '3 сек'
    },
    {
      id: 3,
      date: '23 октября 2024, 14:20',
      notes: ['D', 'F#', 'A'],
      duration: '3 сек'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>История записей</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {historyRecords.map((record) => (
            <div 
              key={record.id} 
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Music" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{record.notes.join(', ')}</p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{record.duration}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="Play" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
