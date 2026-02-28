'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({ settings = {} }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['About', 'Services', 'Portfolio', 'Pricing', 'Contact']

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : ''}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex-shrink-0">
                <picture>
                  <source srcSet="/logo-sm.webp" type="image/webp" />
                  <source srcSet="/logo.png" type="image/png" />
                  <Image src="/logo.png" alt="Anjal Ventures Logo" fill className="object-contain" priority onError={(e) => { e.target.style.display='none' }} />
                </picture>
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-display font-bold text-lg absolute inset-0 opacity-0 logo-fallback">A</div>
              </div>
              <span className="font-display font-bold text-lg text-navy">
                Anjal <span className="text-brand-green">Ventures</span>
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-navy hover:bg-slate-100 transition-all">
                  {link}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a href={`mailto:${settings.company_email || 'anjalventures@gmail.com'}`}
                className="btn btn-outline py-2.5 px-5 text-sm">Email Us</a>
              <a href="#contact" className="btn btn-green py-2.5 px-5 text-sm">Get Started →</a>
            </div>

            {/* Hamburger */}
            <button className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <span className={`w-6 h-0.5 bg-navy rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-navy rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-navy rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-[72px] left-0 right-0 bg-white shadow-xl z-40 flex flex-col p-5 gap-1 lg:hidden">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
              {link}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)}
            className="btn btn-green mt-3 justify-center">Get Started →</a>
        </div>
      )}
    </>
  )
}
