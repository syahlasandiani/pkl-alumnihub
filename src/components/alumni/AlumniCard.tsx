import Link from "next/link";
import { User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { Alumni } from "@/lib/types/alumni";

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
  // Use nickname (username) if available, otherwise use UUID id
  const identifier = alumni.user_id || alumni.id;

  return (
    <Link
      href={`/alumni-directory/${identifier}`}
    >
      <GlassCard className="p-5 hover:bg-white/15 transition text-white cursor-pointer h-full">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 shrink-0">
            {alumni.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={alumni.avatar_url} 
                alt={alumni.full_name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-white/70" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">
              {alumni.full_name}
            </div>

            <div className="text-sm text-white/75 truncate">
              {alumni.degree_level} • {alumni.intake_year} • {alumni.location || "-"}
            </div>

            {alumni.headline && (
              <div className="text-sm text-white/70 truncate mt-0.5">
                {alumni.headline}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}