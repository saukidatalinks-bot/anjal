'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What services does Anjal Ventures provide?',
          a: 'We specialize in web development (Next.js, React), mobile app development (React Native, Flutter), backend systems, AI/ML solutions, cloud infrastructure, and enterprise digital transformation. Whether you need a custom MVP or enterprise-scale platform, we deliver end-to-end solutions.'
        },
        {
          q: 'Where is your team located?',
          a: 'We are based in Damaturu, Yobe State, Nigeria, but we work with clients globally. Our distributed team ensures 24/7 support and collaboration across time zones.'
        },
        {
          q: 'Do you work with startups and small businesses?',
          a: 'Absolutely! We work with businesses of all sizes - from early-stage startups to established enterprises. We tailor our approach and pricing to match your budget and growth stage.'
        }
      ]
    },
    {
      category: 'Project Scope',
      questions: [
        {
          q: 'How long does a typical project take?',
          a: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, mobile apps 8-12 weeks, and enterprise systems 12-24 weeks. During discovery, we provide a detailed timeline with milestones.'
        },
        {
          q: 'What if my project requirements change mid-development?',
          a: `We use Agile methodology, so changes are expected and welcome. We'll assess scope changes, adjust the timeline if needed, and keep you informed every step of the way.`
        },
        {
          q: 'Do you provide ongoing support after launch?',
          a: 'Yes! We offer 24/7 support packages including bug fixes, feature updates, performance optimization, security patches, and database backups. Your success is ongoing.'
        }
      ]
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          q: 'How do you price projects?',
          a: 'We offer flexible pricing models: fixed-price for well-defined projects, time & materials for evolving requirements, and retainer models for ongoing support. We provide detailed quotations after discovery.'
        },
        {
          q: 'What payment terms do you offer?',
          a: 'Typically 30% upfront, 40% at mid-project milestone, and 30% upon launch. For larger contracts, we can arrange payment plans. We accept bank transfers, cryptocurrency, and online payment platforms.'
        },
        {
          q: 'Are there any hidden costs?',
          a: 'No hidden costs. Everything is transparent and outlined in your contract. We provide detailed cost breakdowns by feature/component. Any changes are discussed and quoted separately.'
        }
      ]
    },
    {
      category: 'Technology & Quality',
      questions: [
        {
          q: 'What technologies do you use?',
          a: 'We use modern, battle-tested technologies: Next.js, React, React Native, Node.js, Python, PostgreSQL, MongoDB, AWS/GCP, Firebase, and more. We choose the best tools for your specific needs.'
        },
        {
          q: 'Do you follow coding standards and best practices?',
          a: 'Absolutely. We follow SOLID principles, write clean code, conduct peer reviews, perform extensive testing, and maintain documentation. Code quality is non-negotiable.'
        },
        {
          q: 'Will I own the source code?',
          a: 'Yes, 100% code ownership. You own all code, design assets, and intellectual property. We provide complete documentation and transition support when the project ends.'
        }
      ]
    },
    {
      category: 'Security & Data',
      questions: [
        {
          q: 'How do you handle data security?',
          a: 'We implement industry-standard security: encryption (SSL/TLS), secure authentication (OAuth, JWT), GDPR compliance, regular security audits, and DDoS protection. Security audits are included in our standard process.'
        },
        {
          q: 'Is my data backed up?',
          a: 'Yes, automated daily backups are standard. We maintain multiple backup copies in secure locations and provide disaster recovery procedures. You can restore data at any point.'
        },
        {
          q: 'Do you comply with data protection regulations?',
          a: 'Yes, we ensure GDPR, CCPA, and other international data protection compliance. We help implement privacy policies and consent management appropriate for your users.'
        }
      ]
    },
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I start a project with Anjal Ventures?',
          a: 'Simple: 1) Schedule a free consultation call, 2) We discuss your vision and requirements, 3) We send a detailed proposal with timeline and pricing, 4) You approve and we begin kickoff meeting.'
        },
        {
          q: 'What information do you need from me to provide a quotation?',
          a: `Tell us about your business, the problem you're solving, your target users, key features, budget range (if you have one), and timeline. Details help us provide accurate estimates.`
        },
        {
          q: 'Can I have a meeting with the team before committing?',
          a: `Absolutely. We encourage a discovery call first. This is risk-free consultation to ensure we're the right fit for your project. We can discuss your vision and answer questions.`
        }
      ]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-navy via-slate-900 to-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-green rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Questions</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Can't find the answer you're looking for? <a href="#contact" className="text-brand-gold hover:text-brand-green transition-colors">Chat with us</a>
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {faqs.map((category, index) => (
            <button
              key={index}
              onClick={() => setOpenFAQ(faqs.findIndex(f => f.category === category.category) * 2)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                Math.floor(openFAQ / 2) === index
                  ? 'bg-brand-gold text-navy'
                  : 'bg-white/10 text-white border border-white/20 hover:border-brand-gold/50'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((category, catIndex) =>
            category.questions.map((faq, faqIndex) => {
              const faqIndex_ = catIndex * 2 + faqIndex
              const isOpen = openFAQ === faqIndex_

              return (
                <button
                  key={faqIndex_}
                  onClick={() => setOpenFAQ(isOpen ? -1 : faqIndex_)}
                  className="w-full text-left"
                >
                  <div className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-gold/50 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                        {faq.q}
                      </h3>
                      <span className={`text-2xl text-brand-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        ⌄
                      </span>
                    </div>

                    {/* Answer */}
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                      <p className="text-white/70 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-brand-gold/10 to-brand-green/10 border border-white/20 rounded-3xl p-12">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-white/70 mb-6 max-w-md">
              Our team is ready to answer anything. Schedule a free consultation call with one of our specialists.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-gold to-brand-green text-navy font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105">
              Book Your Free Consultation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
