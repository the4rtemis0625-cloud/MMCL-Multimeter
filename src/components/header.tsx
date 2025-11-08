import { Gauge } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Gauge className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          MMCL Multimeter
        </h1>
      </div>
      <div className="ml-auto">
        <Image src="/multimeter.png" alt="Multimeter" width={40} height={40} />
      </div>
    </header>
  );
}
