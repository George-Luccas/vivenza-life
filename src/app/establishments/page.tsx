import { MainLayout } from "@/components/layout/main-layout";
import { getEstablishments } from "@/app/_actions/establishments";
import { EstablishmentCard } from "@/components/establishment-card";

export const dynamic = 'force-dynamic';

import { BackButton } from "@/components/ui/back-button";

export default async function EstablishmentsPage() {
  const establishments = await getEstablishments();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-4">
                <BackButton href="/" />
                <h1 className="text-3xl font-bold tracking-tight">Cuidado e Beleza</h1>
            </div>
            <p className="text-muted-foreground">Encontre os melhores serviços de saúde, beleza e bem-estar.</p>
        </div>

        {establishments.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
                Nenhum estabelecimento encontrado.
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {establishments.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
            ))}
            </div>
        )}
      </div>
    </MainLayout>
  );
}
