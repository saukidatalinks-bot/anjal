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
    <section className="py-24 bg-gradient-to-br from-apple-light via-white to-apple-light">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Common Questions
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-apple-space-gray max-w-2xl mx-auto font-light">
            Have questions? Our team is here to help. <a href="#contact" className="text-apple-blue font-semibold hover:text-apple-blue-hover">Get in touch →</a>
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
                  ? 'border-apple-dark text-white bg-apple-dark'
                  : 'border-apple-light-secondary text-apple-space-gray bg-white hover:bg-apple-light'
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
                  <div className="border border-apple-light-secondary bg-white hover:bg-apple-light rounded-xl p-6 transition-all duration-200 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-apple-dark">
                        {faq.q}
                      </h3>
                      <span className={`text-lg text-apple-space-gray flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ⌄
                      </span>
                    </div>

                    {/* Answer */}
                    <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                      <p className="text-apple-space-gray leading-relaxed text-sm font-light">{faq.a}</p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white border border-apple-light-secondary rounded-2xl p-12 shadow-sm">
            <h3 className="text-2xl font-semibold text-apple-dark mb-4">Still have questions?</h3>
            <p className="text-apple-space-gray mb-8 max-w-md font-light">
              Our team is here to help. Get in touch with us for a personalized consultation.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 bg-apple-dark text-white font-semibold rounded-lg hover:bg-apple-dark-secondary transition-colors">
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
