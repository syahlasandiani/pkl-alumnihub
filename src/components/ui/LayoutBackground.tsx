"use client";

import React from "react";

type LayoutBackgroundProps = {
  isAdmin?: boolean;
};

export default function LayoutBackground({ isAdmin = false }: LayoutBackgroundProps) {
  // Latar belakang disesuaikan: admin (home-admin.jpg), non-admin (home-bg.jpg)
  const backgroundImage = isAdmin
    ? "url(/assets/backgrounds/home-admin.jpg)"
    : "url(/assets/backgrounds/home-bg.jpg)";

  // Standardized overlay opacity (bg-black/35) across the entire application
  return (
    <>
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />
    </>
  );
}
