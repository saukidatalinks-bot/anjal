import {
  managementSignoff,
  normalizeCacNumber,
  normalizeCompanyAddress,
  normalizeDunsNumber,
  normalizeTinNumber,
  officialEmails,
  officialPhone,
} from '@/lib/company'

async function loadLogoDataUrl() {
  if (typeof window === 'undefined') return null
  try {
    const res = await fetch('/logo-pdf.png')
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function pdfCurrency(amount) {
  const num = Number(amount || 0)
  if (!Number.isFinite(num)) return 'NGN 0'
  return `NGN ${Math.round(num).toLocaleString('en-NG')}`
}

const CATEGORY_LABELS = {
  platform: 'Platform / Suite',
  type: 'Platform / Suite',
  scope: 'Architecture Scope',
  scale: 'Architecture Scope',
  design: 'Design System',
  timeline: 'Delivery Speed',
  support: 'Support Plan',
  addon: 'Technical Add-on',
}

export async function generateProposalPdf({
  reference,
  settings = {},
  form = {},
  selectedItems = [],
  totalNaira = 0,
  requiresMaintenance = false,
}) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 16
  const contentW = pageW - margin * 2

  const cac = normalizeCacNumber(settings.company_cac)
  const tin = normalizeTinNumber(settings.company_tin)
  const duns = normalizeDunsNumber(settings.company_duns)
  const address = normalizeCompanyAddress(settings.company_address)
  const email = settings.company_email || officialEmails.general
  const phone = settings.company_phone || officialPhone

  const drawFooter = pageNum => {
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, pageH - 18, pageW - margin, pageH - 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(`${managementSignoff}  |  RC: ${cac}  |  TIN: ${tin}  |  D-U-N-S: ${duns}`, margin, pageH - 12)
    doc.text(`Page ${pageNum}`, pageW - margin, pageH - 12, { align: 'right' })
  }

  // Top Header Band
  doc.setFillColor(10, 22, 40)
  doc.rect(0, 0, pageW, 46, 'F')

  const logoDataUrl = await loadLogoDataUrl()
  let textStartX = margin
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(margin, 9, 18, 18, 2.5, 2.5, 'F')
    doc.addImage(logoDataUrl, 'PNG', margin + 1.5, 10.5, 15, 15)
    textStartX = margin + 23
  }

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('ANJAL SOLUTIONS LTD', textStartX, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(186, 200, 220)
  doc.text(`RC: ${cac}   |   TIN: ${tin}   |   D-U-N-S: ${duns}`, textStartX, 22)
  doc.text(`${email}   |   ${phone}`, textStartX, 27.5)

  doc.setFontSize(7.5)
  doc.setTextColor(148, 163, 184)
  doc.text(doc.splitTextToSize(address, 122), margin, 36.5)

  doc.setTextColor(56, 189, 248)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('COMMERCIAL QUOTATION', pageW - margin, 16, { align: 'right' })
  doc.setTextColor(226, 232, 240)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Ref: ${reference}`, pageW - margin, 22, { align: 'right' })
  doc.text(`Issued: ${new Date().toLocaleDateString('en-GB')}`, pageW - margin, 27.5, { align: 'right' })

  let y = 57
  let currentPage = 1

  const ensureSpace = needed => {
    if (y + needed > pageH - 25) {
      drawFooter(currentPage)
      doc.addPage()
      currentPage += 1
      y = 20
    }
  }

  const drawSectionHeading = label => {
    ensureSpace(16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(30, 64, 175)
    doc.text(label.toUpperCase(), margin, y)
    y += 2.5
    doc.setDrawColor(203, 213, 225)
    doc.line(margin, y, pageW - margin, y)
    y += 5.5
  }

  // Project Title & Intro
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  const headingTitle = doc.splitTextToSize(
    form.project_title || selectedItems[0]?.name || 'Custom Digital Platform Quotation',
    contentW
  )
  doc.text(headingTitle, margin, y)
  y += headingTitle.length * 6 + 2

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  const intro = doc.splitTextToSize(
    `Prepared for ${form.client_name || 'Client Principal'}${form.entity_name ? ` (${form.entity_name})` : ''} · All pricing is denominated cleanly in Nigerian Naira (NGN) and valid for 30 calendar days from date of issue.`,
    contentW
  )
  doc.text(intro, margin, y)
  y += intro.length * 4.5 + 6

  // Client Box
  drawSectionHeading('Client & Organization Particulars')
  const clientPairs = [
    ['Primary Contact', form.client_name || 'Not specified'],
    ['Organization', form.entity_name || 'Individual / Direct Client'],
    ['Email Address', form.email || 'Not specified'],
    ['Telephone / WhatsApp', form.phone || 'Not specified'],
    ['Location / Address', form.address || 'Not specified'],
  ]

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(margin, y - 2, contentW, clientPairs.length * 6 + 4, 2, 2, 'FD')
  y += 3
  clientPairs.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    doc.text(`${k}:`, margin + 4, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.text(String(v), margin + 46, y)
    y += 6
  })
  y += 6

  // Itemized Scope Table
  drawSectionHeading('Itemized Commercial Schedule (NGN)')

  doc.setFillColor(241, 245, 249)
  doc.rect(margin, y - 4, contentW, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(51, 65, 85)
  doc.text('#', margin + 3, y + 1)
  doc.text('Component / Deliverable', margin + 10, y + 1)
  doc.text('Category', margin + 108, y + 1)
  doc.text('Amount (NGN)', pageW - margin - 3, y + 1, { align: 'right' })
  y += 8

  selectedItems.forEach((item, index) => {
    const rawPrice = Number(item.calculated_price ?? item.price ?? item.base_price ?? 0)
    const mult = Number(item.multiplier || 1)
    const catLabel = CATEGORY_LABELS[item.category || item.group] || item.category || 'Component'
    const amountLabel =
      rawPrice > 0
        ? pdfCurrency(rawPrice)
        : mult !== 1
          ? `x${mult.toFixed(2)} Factor`
          : 'Included'

    const descText = item.description ? doc.splitTextToSize(item.description, 94) : []
    const rowHeight = 6 + (descText.length ? descText.length * 3.8 + 1 : 0)
    ensureSpace(rowHeight + 4)

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, y - 3.5, contentW, rowHeight, 'F')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(15, 23, 42)
    doc.text(String(index + 1), margin + 3, y + 0.5)
    doc.text(doc.splitTextToSize(item.name || 'Deliverable', 94)[0], margin + 10, y + 0.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(catLabel, margin + 108, y + 0.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(3, 105, 161)
    doc.text(amountLabel, pageW - margin - 3, y + 0.5, { align: 'right' })

    y += 4.8
    if (descText.length) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)
      doc.text(descText, margin + 10, y)
      y += descText.length * 3.8 + 1.5
    } else {
      y += 1.5
    }
  })

  // Total Box
  ensureSpace(34)
  y += 4
  doc.setFillColor(10, 22, 40)
  doc.roundedRect(margin, y, contentW, requiresMaintenance ? 22 : 17, 2.5, 2.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(186, 200, 220)
  doc.text('ESTIMATED TOTAL INVESTMENT', margin + 6, y + 7)
  doc.setFontSize(13)
  doc.setTextColor(255, 255, 255)
  doc.text(pdfCurrency(totalNaira), pageW - margin - 6, y + 8, { align: 'right' })

  if (requiresMaintenance) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(252, 211, 77)
    doc.text('Note: Operational maintenance fees apply post-deployment.', margin + 6, y + 16)
    y += 26
  } else {
    y += 21
  }

  // Goals & Technical Notes
  if (form.goals || form.notes) {
    drawSectionHeading('Client Objectives & Integration Notes')
    const notesText = [
      form.goals ? `Business Objectives: ${form.goals}` : null,
      form.notes ? `Technical Notes: ${form.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n\n')
    const wrappedNotes = doc.splitTextToSize(notesText, contentW)
    ensureSpace(wrappedNotes.length * 4.5 + 10)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(51, 65, 85)
    doc.text(wrappedNotes, margin, y)
    y += wrappedNotes.length * 4.5 + 6
  }

  // Commercial Terms
  ensureSpace(24)
  drawSectionHeading('Standard Terms & Sign-off')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  const terms = doc.splitTextToSize(
    '1. Milestone billing: 50% mobilization upon engagement commencement, 30% upon staging delivery, 20% upon final launch & source handover. 2. Full client ownership of source repository upon final settlement.',
    contentW
  )
  doc.text(terms, margin, y)
  y += terms.length * 4.2 + 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(15, 23, 42)
  doc.text(managementSignoff, margin, y)

  drawFooter(currentPage)
  return doc
}
