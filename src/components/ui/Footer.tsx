// src/components/layout/Footer.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

// Data untuk link agar mudah dikelola
const tautanTerkait = [
  { href: '#', text: 'Kemendikdasmen' },
  { href: '#', text: 'Setjen Kemendikdasmen' },
  { href: '#', text: 'Ditjen PAUD dan Dikdasdikmen' },
  { href: '#', text: 'Ditjen Vokasi' },
  { href: '#', text: 'Ditjen GTK' },
  { href: '#', text: 'Badan Pengembangan dan Pembinaan Bahasa' },
  { href: '#', text: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan' },
  { href: '#', text: 'Inspektorat Jenderal' },
];

const program = [
  { href: '#', text: 'Afirmasi Pendidikan Menengah' },
  { href: '#', text: 'Beasiswa Unggulan' },
  { href: '#', text: 'Beasiswa Pendidikan Indonesia' },
  { href: '#', text: 'Program Indonesia Pintar' },
  { href: '#', text: 'Aneka Tunjangan' },
];

const socialMedia = [
  { href: '#', icon: <FaFacebook size={20} />, label: 'Facebook' },
  { href: '#', icon: <FaTwitter size={20} />, label: 'Twitter' },
  { href: '#', icon: <FaInstagram size={20} />, label: 'Instagram' },
  { href: '#', icon: <FaYoutube size={20} />, label: 'YouTube' },
  { href: '#', icon: <MessageCircle size={20} />, label: 'TikTok' }, // Placeholder
];

const Footer = () => {
  return (
    <footer className="bg-[#212529] text-gray-300 z-10">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: Logo dan Info */}
          <div className="space-y-6">
            <div className='relative w-48 h-25'>
              <Image src="/assets/footer.png" alt="Logo Puslapdik" fill className="object-contain" />
            </div>
            <h3 className="font-semibold text-white text-lg">Pusat Layanan Pembiayaan Pendidikan</h3>
            <p className="text-sm">Kementerian Pendidikan Dasar dan Menengah Republik Indonesia</p>
          </div>

          {/* Kolom 2: Kontak Kami */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg">Kontak Kami</h3>
            <p className="text-sm leading-relaxed">
              Gedung C Lantai 13<br />
              Jl. Jenderal Sudirman, Senayan<br />
              Jakarta Pusat 10270
            </p>
            <p className="text-sm">Telepon: 177</p>
            <p className="text-sm">
              Surel: <a href="mailto:pengaduan@kemendikdasmen.go.id" className="hover:text-white hover:underline break-normal">pengaduan@kemendikdasmen.go.id</a>
            </p>
          </div>

          {/* Kolom 3: Tautan Terkait */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg">Tautan Terkait</h3>
            <ul className="space-y-2">
              {tautanTerkait.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-white hover:underline">{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Program */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg">Program</h3>
            <ul className="space-y-2">
              {program.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:text-white hover:underline">{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col-reverse md:flex-row items-center justify-between text-sm">
          <p className="text-gray-500 mt-4 md:mt-0">Copyright © 2025 Pusat Layanan Pembiayaan Pendidikan. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            {socialMedia.map((social, index) => (
              <Link key={index} href={social.href} aria-label={social.label} className="p-2 border border-gray-600 rounded-md hover:bg-gray-700 hover:text-white transition-colors">
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;