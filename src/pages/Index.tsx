import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import RecordTab from '@/components/RecordTab';
import HistoryTab from '@/components/HistoryTab';
import LearnTab from '@/components/LearnTab';
import ChordsTab from '@/components/ChordsTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('record');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Guitar Note Recognition</h1>
          <p className="text-muted-foreground">Запишите звук и узнайте ноты для гитары</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Icon name="Mic" size={18} />
              <span>Записать</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="History" size={18} />
              <span>История</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Icon name="GraduationCap" size={18} />
              <span>Обучение</span>
            </TabsTrigger>
            <TabsTrigger value="chords" className="flex items-center gap-2">
              <Icon name="Music" size={18} />
              <span>Аккорды</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record">
            <RecordTab />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>

          <TabsContent value="learn">
            <LearnTab />
          </TabsContent>

          <TabsContent value="chords">
            <ChordsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
