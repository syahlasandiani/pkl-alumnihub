// src/features/learning-hub/components/HubSectionHeader.tsx
type Props = { title: string };

export default function HubSectionHeader({ title }: Props) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-4">
        <h3 className="text-white font-semibold text-lg shrink-0">{title}</h3>
        <div className="h-px flex-1 bg-white/15" />
      </div>
      <div className="mt-3 relative">
        <div className="h-px bg-white/10" />
        <div className="absolute left-0 -top-[1px] h-[3px] w-28 rounded-full bg-white/70" />
      </div>
    </div>
  );
}