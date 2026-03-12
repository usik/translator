import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ConvertCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
}

export function ConvertCard({
  icon: Icon,
  title,
  description,
  slug,
}: ConvertCardProps) {
  return (
    <Link href={`/convert/${slug}`}>
      <Card className="group cursor-pointer transition-all hover:ring-2 hover:ring-primary/20">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
