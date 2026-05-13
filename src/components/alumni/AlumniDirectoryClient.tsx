"use client";

import { useEffect, useMemo, useState } from "react";

import SectionHeading from "@/components/shared/SectionHeading";
import { MUTED_COLORS } from "@/components/alumni/AlumniStatsDonut";
import SearchInput from "@/components/ui/SearchInput";
import BackCTA from "@/components/ui/BackCTA";
import AlumniFilters from "@/components/alumni/AlumniFilters";
import AlumniCard from "@/components/alumni/AlumniCard";
import AlumniStatsDonut from "@/components/alumni/AlumniStatsDonut";
import { alumniMock } from "@/lib/data/mock/alumni.mock";
import type { Alumni } from "@/lib/types/alumni";

function generateAlumniMock100(base: Alumni[], target = 100): Alumni[] {
  const out: Alumni[] = [];
  let i = 0;

  while (out.length < target) {
    const src = base[i % base.length];
    const n = Math.floor(out.length / base.length) + 1;

    out.push({
      ...src,
      id: `${src.id}-${n}`, // unik
      full_name: n === 1 ? src.full_name : `${src.full_name} ${n}`, // variasi dikit
    });

    i++;
  }

  return out;
}

interface AlumniDirectoryClientProps {
  initialData: Alumni[];
}

export default function AlumniDirectoryClient({ initialData }: AlumniDirectoryClientProps) {
  const alumniData = initialData;

  const YEARS = useMemo(() => {
    const set = new Set<number>();
    alumniData.forEach((a) => set.add(a.intake_year));
    return Array.from(set)
      .sort((a, b) => b - a)
      .map((y) => String(y));
  }, [alumniData]);

  const [year, setYear] = useState<string>("Semua");
  const [degree, setDegree] = useState<string>("Semua");
  const [query, setQuery] = useState<string>("");

  // pagination (desktop)
  const PAGE_SIZE = 24;
  const [page, setPage] = useState<number>(1);

  // reset page kalau filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [year, degree, query]);

  const filtered: Alumni[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    return alumniData.filter((a) => {
      const okYear = year === "Semua" ? true : String(a.intake_year) === year;
      const okDegree = degree === "Semua" ? true : a.degree_level === degree;

      const okQuery =
        q.length === 0
          ? true
          : [a.full_name, a.institution, a.field, a.location, a.headline]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(q);

      return okYear && okDegree && okQuery;
    });
  }, [year, degree, query, alumniData]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length]
  );

  // clamp page kalau kebesaran setelah filter
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const currentShowing = useMemo(() => {
    if (filtered.length === 0) return 0;
    const left = filtered.length - (page - 1) * PAGE_SIZE;
    return Math.min(PAGE_SIZE, left);
  }, [filtered.length, page]);

  // stats (pakai city/location)
  const statsData = useMemo(() => {
    const map = new Map<string, number>();

    for (const a of filtered) {
      const key = (a.location || "Tidak diketahui").trim();
      map.set(key, (map.get(key) || 0) + 1);
    }

    const sorted = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top = sorted.slice(0, 8);
    const rest = sorted.slice(8).reduce((acc, cur) => acc + cur.value, 0);
    if (rest > 0) top.push({ name: "Lainnya", value: rest });

    return top;
  }, [filtered]);

  const totalPenerimaBU = filtered.length;

  return (
    <section id="alumni" className="px-6 scroll-mt-32 min-h-[calc(100vh-96px)]">
      <div className="max-w-6xl mx-auto w-full pt-6 pb-24">
        {/* Back CTA */}
        <BackCTA className="mb-4" />

        <SectionHeading
          title="Direktori Alumni"
          subtitle="Cari alumni berdasarkan tahun dan jenjang."
          align="center"
        />

        {/* Search + Filters */}
        <div className="mt-8 flex items-center justify-between gap-6">
          <AlumniFilters
            year={year}
            setYear={setYear}
            degree={degree}
            setDegree={setDegree}
            years={YEARS}
          />

          <div className="w-[360px]">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari nama, institusi, bidang..."
            />
          </div>
        </div>

        <div className="mt-6 text-center text-white/70 text-sm">
          Menampilkan{" "}
          <span className="text-white">{currentShowing}</span> dari{" "}
          <span className="text-white">{filtered.length}</span> alumni — Halaman{" "}
          <span className="text-white">{page}</span>/
          <span className="text-white">{totalPages}</span>
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="mt-12 text-center text-white/70">
            Tidak ada alumni yang cocok dengan pencarian atau filter kamu.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-4 gap-8">
              {paged.map((alumni) => (
                <AlumniCard key={alumni.user_id || alumni.id} alumni={alumni} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-3 text-white/80">
                <button
                  className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages })
                    .slice(0, 7)
                    .map((_, idx) => {
                      const p = idx + 1;
                      const active = p === page;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={[
                            "w-10 h-10 rounded-xl border",
                            active
                              ? "border-white/30 bg-white/20 text-white"
                              : "border-white/15 bg-white/10 hover:bg-white/15",
                          ].join(" ")}
                        >
                          {p}
                        </button>
                      );
                    })}

                  {totalPages > 7 ? (
                    <span className="px-2 text-white/60">…</span>
                  ) : null}

                  {totalPages > 7 ? (
                    <button
                      onClick={() => setPage(totalPages)}
                      className={[
                        "w-10 h-10 rounded-xl border",
                        page === totalPages
                          ? "border-white/30 bg-white/20 text-white"
                          : "border-white/15 bg-white/10 hover:bg-white/15",
                      ].join(" ")}
                    >
                      {totalPages}
                    </button>
                  ) : null}
                </div>

                <button
                  className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}

        {/* Statistik */}
        <div className="mt-20">
          <SectionHeading
            title="Statistik"
            subtitle="Ringkasan berdasarkan hasil filter saat ini."
            align="center"
          />

          <div className="mt-10 grid grid-cols-3 gap-8">
            {/* Donut */}
            <div className="col-span-2 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-8">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Persebaran Alumni (Top Domisili)
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  Berdasarkan kota/domisili (top 8 + lainnya).
                </p>
              </div>

              <AlumniStatsDonut data={statsData} />

              {/* Legend */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                {statsData.map((d, i) => (
                  <div
                    key={d.name}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            MUTED_COLORS[i % MUTED_COLORS.length],
                        }}
                      />
                      <span className="truncate">{d.name}</span>
                    </div>

                    <span className="font-medium text-white">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="col-span-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-8">
              <h3 className="text-lg font-semibold text-white">
                Total Penerima BU
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Mengikuti filter (tahun, jenjang, pencarian).
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <div className="text-5xl font-semibold text-white">
                  {totalPenerimaBU}
                </div>
                <div className="mt-2 text-sm text-white/70">alumni / awardee</div>
              </div>

              {/* Breakdown jenjang */}
              <div className="mt-5 space-y-2 text-sm">
                {(["S1", "S2", "S3"] as const).map((lvl) => {
                  const count = filtered.filter((a) => a.degree_level === lvl)
                    .length;
                  return (
                    <div
                      key={lvl}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className="text-white/80">{lvl}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}