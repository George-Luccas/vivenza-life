import { MainLayout } from "@/components/layout/main-layout";

export default function AppointmentsPage() {
  return (
    <MainLayout>
       <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">Seus agendamentos aparecerão aqui.</p>
       </div>
    </MainLayout>
  );
}
