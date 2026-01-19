import { getMarketplaceProducts } from "@/app/_actions/marketplace";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductItem } from "@/components/product-item";
import { ShoppingBag } from "lucide-react";

export default async function MarketplacePage() {
  const products = await getMarketplaceProducts();

  return (
    <MainLayout>
       <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                <ShoppingBag size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold">Marketplace</h1>
                <p className="text-muted-foreground text-sm">Produtos das melhores linhas diretamente para você.</p>
            </div>
        </div>
        
        {products.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border rounded-xl bg-muted/20">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map(product => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        )}
       </div>
    </MainLayout>
  );
}
