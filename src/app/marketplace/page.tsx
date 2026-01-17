import { MainLayout } from "@/components/layout/main-layout";

export default function MarketplacePage() {
  return (
    <MainLayout>
       <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Produtos e serviços em breve.</p>
       </div>
    </MainLayout>
  );
}
