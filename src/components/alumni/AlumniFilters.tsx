import GlassSelect from "@/components/ui/GlassSelect";

type Props = {
  year: string;
  setYear: (v: string) => void;
  degree: string;
  setDegree: (v: string) => void;
  years: string[];
};

export default function AlumniFilters({
  year,
  setYear,
  degree,
  setDegree,
  years,
}: Props) {
  const yearOptions = [
    { label: "Semua Tahun", value: "Semua" },
    ...years.map((y) => ({ label: y, value: y })),
  ];

  const degreeOptions = [
    { label: "Semua Jenjang", value: "Semua" },
    { label: "S1", value: "S1" },
    { label: "S2", value: "S2" },
    { label: "S3", value: "S3" },
  ];

  return (
    <div className="flex items-center gap-4">
      <GlassSelect
        ariaLabel="Filter tahun"
        value={year}
        onChange={setYear}
        options={yearOptions}
      />

      <GlassSelect
        ariaLabel="Filter jenjang"
        value={degree}
        onChange={setDegree}
        options={degreeOptions}
      />
    </div>
  );
}