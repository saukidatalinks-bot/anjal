'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      category: 'Services',
      questions: [
        {
          q: 'What services do you offer?',
          a: 'We provide custom web development, mobile applications, cloud infrastructure, backend systems, and digital transformation consulting. Each project is tailored to your specific business needs.'
        },
        {
          q: 'Do you work remotely?',
          a: 'Yes. We are based in Nigeria but work with clients globally. We maintain excellent communication and regular progress updates throughout all projects.'
        }
      ]
    },
    {
      category: 'Process',
      questions: [
        {
          q: 'How long does a project typically take?',
          a: 'Project timelines vary based on scope and complexity. Most projects range from 8-16 weeks. We provide a detailed timeline and milestones after our initial discovery phase.'
        },
        {
          q: 'What is your development process?',
          a: 'We follow a proven 6-phase process: discovery, design, development, testing, deployment, and ongoing support. You\'ll have regular updates and demo sessions throughout.'
        }
      ]
    },
    {
      category: 'Pricing',
      questions: [
        {
          q: 'How do you price projects?',
          a: 'We offer flexible pricing models: fixed-price for well-defined projects, time & materials for evolving requirements, and retainer models for ongoing support. We provide detailed quotations after discovery.'
        },
        {
          q: 'What payment terms do you offer?',
          a: 'Standard terms are 30% upfront, 40% at mid-point, and 30% upon delivery. We can discuss alternative arrangements based on your preferences.'
        }
      ]
    },
    {
      category: 'Code & Support',
      questions: [
        {
          q: 'Do I own the code?',
          a: 'Yes. You receive 100% ownership of all code, design assets, and intellectual property. We provide full documentation and support handing off to your team.'
        },
        {
          q: 'What support do you offer after launch?',
          a: 'We provide ongoing support packages including bug fixes, security updates, performance optimization, and feature development. 24/7 support is available.'
        }
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? Our team is here to help. <a href="#contact" className="text-black font-semibold hover:text-gray-700">Get in touch →</a>
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
                  ? 'border-black text-black bg-white'
                  : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
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
                  <div className="border border-gray-200 bg-white hover:bg-gray-50 rounded-lg p-6 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-black">
                        {faq.q}
                      </h3>
                      <span className={`text-lg text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ⌄
                      </span>
                    </div>

                    {/* Answer */}
                    <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                      <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg p-12">
            <h3 className="text-2xl font-semibold text-black mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              Our team is here to help. Get in touch with us for a personalized consultation.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              Get in Touch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
