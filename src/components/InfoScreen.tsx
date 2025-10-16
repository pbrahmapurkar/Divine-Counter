import { Header } from './Header';

interface InfoScreenProps {
  title: string;
  description: string;
  body: string[];
  onBack: () => void;
}

export function InfoScreen({ title, description, body, onBack }: InfoScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        title={title}
        subtitle={description}
        showBackButton={true}
        onBack={onBack}
      />
      
      <div className="px-6 pb-6 space-y-6" style={{ paddingTop: '100px' }}>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-4 leading-relaxed text-muted-foreground">
          {body.map((paragraph, index) => (
            <p key={index} className="text-base text-foreground/80">
              {paragraph}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
