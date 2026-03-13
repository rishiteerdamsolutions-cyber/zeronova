import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  ngoName: string;
  ngoLogo?: string | null;
  verified?: boolean;
  className?: string;
}

export function OpportunityCard({
  id,
  title,
  description,
  category,
  ngoName,
  ngoLogo,
  verified,
  className,
}: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${id}`}>
      <Card
        className={cn(
          "overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)] cursor-pointer",
          className
        )}
      >
        <div className="aspect-video relative bg-[var(--background-secondary)]">
          {ngoLogo ? (
            <Image
              src={ngoLogo}
              alt={ngoName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-[var(--foreground-muted)]">🌱</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary">{category}</Badge>
            {verified && (
              <Badge className="bg-[var(--success)]/20 text-[var(--success)]">Verified</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-[var(--foreground)] line-clamp-1">{title}</h3>
          <p className="text-sm text-[var(--foreground-secondary)] line-clamp-2 mt-1">
            {description}
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">{ngoName}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <span className="text-sm text-[var(--accent)] font-medium">View details →</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
