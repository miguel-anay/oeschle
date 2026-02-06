export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
        <p className="text-muted-foreground">
          Escanea o ingresa un código de barras para buscar productos
        </p>
        {/* BarcodeInput component will go here */}
        <div className="rounded-lg border border-dashed border-muted-foreground/50 p-8">
          <p className="text-sm text-muted-foreground">
            Componente BarcodeInput próximamente
          </p>
        </div>
      </div>
    </main>
  );
}
