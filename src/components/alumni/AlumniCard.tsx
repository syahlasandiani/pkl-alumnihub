import Link from "next/link";
import { User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { Alumni } from "@/lib/types/alumni";

// export default function AlumniCard({ alumni }: { alumni: Alumni }) {
//   return (
//     <GlassCard className="p-5 hover:bg-white/15 transition text-white">
//       <div className="flex items-center gap-4">
//         <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
//           <User className="h-6 w-6 text-white/70" />
//         </div>

//         <div className="min-w-0 flex-1">
//           <div className="font-semibold truncate text-white">
//             {alumni.full_name}
//           </div>

//           <div className="text-sm text-white/75">
//             {alumni.degree_level} • {alumni.intake_year}
//             {alumni.location ? ` • ${alumni.location}` : ""}
//           </div>

//           {alumni.headline ? (
//             <div className="text-sm text-white/70 truncate">
//               {alumni.headline}
//             </div>
//           ) : null}
//         </div>

//         <Link
//           href={alumni.username ? `/alumni/${alumni.username}` : "/alumni"}
//           className="text-sm text-white/80 hover:text-white underline underline-offset-4 transition"
//         >
//           Lihat
//         </Link>
//       </div>
//     </GlassCard>
//   );
// }

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <Link
      href={alumni.username ? `/alumni/${alumni.username}` : "/alumni"}
    >
      <GlassCard className="p-5 hover:bg-white/15 transition text-white cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <User className="h-6 w-6 text-white/70" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">
              {alumni.full_name}
            </div>

            <div className="text-sm text-white/75">
              {alumni.degree_level} • {alumni.intake_year}
              {alumni.location ? ` • ${alumni.location}` : ""}
            </div>

            {alumni.headline && (
              <div className="text-sm text-white/70 truncate">
                {alumni.headline}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}