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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-apple-light-secondary' 
          : 'bg-white'
      }`}>
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
                <div className="w-10 h-10 bg-apple-dark rounded-lg flex items-center justify-center text-white font-display font-bold text-lg absolute inset-0 opacity-0 logo-fallback">A</div>
              </div>
              <span className="font-display font-bold text-lg text-apple-dark">
                Anjal Ventures
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {links.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a href={`mailto:${settings.company_email || 'anjalventures@gmail.com'}`}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                Email
              </a>
              <a href="#estimator-quotation" className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
                Get Quote
              </a>
            </div>

            {/* Hamburger */}
            <button className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <span className={`w-6 h-0.5 bg-black rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-black rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-black rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 flex flex-col p-5 gap-2 lg:hidden">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all">
              {link}
            </a>
          ))}
          <a href="#estimator-quotation" onClick={() => setMobileOpen(false)}
            className="px-4 py-3 rounded-lg text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-colors text-center mt-3">
            Get Quote
          </a>
        </div>
      )}
    </>
  )
}
