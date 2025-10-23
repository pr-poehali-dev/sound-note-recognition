import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  level: string;
}

const LearnTab = () => {
  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Основы настройки гитары',
      description: 'Научитесь настраивать гитару по стандартному строю',
      icon: 'Tuning',
      level: 'Начальный'
    },
    {
      id: 2,
      title: 'Открытые струны',
      description: 'Изучите названия и частоты открытых струн',
      icon: 'Music2',
      level: 'Начальный'
    },
    {
      id: 3,
      title: 'Первые три лада',
      description: 'Запомните расположение нот на первых трёх ладах',
      icon: 'GraduationCap',
      level: 'Средний'
    },
    {
      id: 4,
      title: 'Хроматическая гамма',
      description: 'Понимание полутонов и расположения всех нот',
      icon: 'TrendingUp',
      level: 'Продвинутый'
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Уроки и упражнения</CardTitle>
          <CardDescription>
            Изучите расположение нот на грифе гитары
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon name={lesson.icon as any} size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{lesson.title}</CardTitle>
                  <p className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full inline-block">
                    {lesson.level}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearnTab;
