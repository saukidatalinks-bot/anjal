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
    return await new Promise((resolve) => {
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
  return `NGN ${Math.round(Number(amount || 0)).toLocaleString('en-NG')}`
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
  const margin = 16
  const contentW = pageW - margin * 2

  const cac = normalizeCacNumber(settings.company_cac)
  const tin = normalizeTinNumber(settings.company_tin)
  const duns = normalizeDunsNumber(settings.company_duns)
  const address = normalizeCompanyAddress(settings.company_address)
  const email = settings.company_email || officialEmails.general
  const phone = settings.company_phone || officialPhone

  // Header band
  doc.setFillColor(10, 22, 40)
  doc.rect(0, 0, pageW, 50, 'F')

  const logoDataUrl = await loadLogoDataUrl()
  let textStartX = margin
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(margin, 10, 18, 18, 2.5, 2.5, 'F')
    doc.addImage(logoDataUrl, 'PNG', margin + 1.5, 11.5, 15, 15)
    textStartX = margin + 23
  }

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.text('ANJAL SOLUTIONS LTD', textStartX, 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(186, 200, 220)
  doc.text(`RC: ${cac}  |  TIN: ${tin}  |  D-U-N-S: ${duns}`, textStartX, 24)
  doc.text(`${email}  |  ${phone}`, textStartX, 29.5)
  doc.text(doc.splitTextToSize(address, 112), margin, 38)

  doc.setTextColor(56, 189, 248)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('OFFICIAL QUOTATION', pageW - margin, 17, { align: 'right' })
  doc.setTextColor(226, 232, 240)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Ref: ${reference}`, pageW - margin, 24, { align: 'right' })
  doc.text(`Issued: ${new Date().toLocaleDateString('en-NG')}`, pageW - margin, 29.5, { align: 'right' })

  let y = 62

  const section = (label) => {
    if (y > 258) {
      doc.addPage()
      y = 20
    }
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(10, 22, 40)
    doc.text(label.toUpperCase(), margin, y)
    y += 3
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y, pageW - margin, y)
    y += 6
  }

  // Title block
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(form.project_title || selectedItems[0]?.name || 'Custom Digital System Proposal', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  const intro = doc.splitTextToSize(
    `Prepared for ${form.client_name || 'Client Principal'}${form.entity_name ? ` (${form.entity_name})` : ''} · ${form.email || email}. Valid for 30 calendar days from date of issue.`,
    contentW
  )
  doc.text(intro, margin, y)
  y += intro.length * 4.5 + 3

  section('Client & Organization Details')
  const clientLines = [
    `Client Contact: ${form.client_name || 'Designated Stakeholder'}`,
    form.entity_name ? `Organization: ${form.entity_name}` : null,
    form.email ? `Email: ${form.email}` : null,
    form.phone ? `Telephone / WhatsApp: ${form.phone}` : null,
    form.address ? `Location / Address: ${form.address}` : null,
  ].filter(Boolean)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(51, 65, 85)
  clientLines.forEach((line) => {
    doc.text(line, margin, y)
    y += 5
  })

  section('Itemized Scope & Deliverables (NGN)')
  selectedItems.forEach((item, index) => {
    if (y > 258) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(15, 23, 42)
    doc.text(`${index + 1}. ${item.name} (${item.group})`, margin, y)
    doc.setTextColor(3, 105, 161)
    doc.text(pdfCurrency(item.calculated_price || 0), pageW - margin, y, { align: 'right' })
    y += 4.5
    if (item.description) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      const descLines = doc.splitTextToSize(item.description, contentW - 28)
      doc.text(descLines, margin + 4, y)
      y += descLines.length * 4 + 2
    } else {
      y += 2
    }
  })

  section('Commercial Investment Summary')
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(203, 213, 225)
  doc.roundedRect(margin, y - 2, contentW, requiresMaintenance ? 24 : 18, 2, 2, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(10, 22, 40)
  doc.text('Total Estimated Build Investment', margin + 5, y + 6)
  doc.setTextColor(3, 105, 161)
  doc.setFontSize(13)
  doc.text(pdfCurrency(totalNaira), pageW - margin - 5, y + 6, { align: 'right' })
  if (requiresMaintenance) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    doc.text('Note: Ongoing platform hosting & maintenance fees apply based on deployment SLA.', margin + 5, y + 14)
  }
  y += requiresMaintenance ? 28 : 22

  section('Engagement Terms & Delivery Standard')
  const terms = [
    'Milestone payment schedule: 50% mobilization deposit, 40% staging/UAT milestone, 10% production launch.',
    'Full source code, repository, and database ownership handed over upon final settlement.',
    '30-day post-launch warranty covering critical defect resolution and production stability.',
    'Maintenance & cloud infrastructure fees apply for managed deployments where specified.',
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  terms.forEach((term) => {
    const lines = doc.splitTextToSize(`• ${term}`, contentW)
    doc.text(lines, margin, y)
    y += lines.length * 4.2 + 1
  })

  if (form.goals || form.notes) {
    section('Project Notes & Objectives')
    const noteLines = doc.splitTextToSize([form.goals, form.notes].filter(Boolean).join('\n'), contentW)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(noteLines, margin, y)
    y += noteLines.length * 4.5 + 4
  }

  // Footer sign-off
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, 276, pageW - margin, 276)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)
  doc.text(managementSignoff, margin, 282)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(`RC: ${cac} · TIN: ${tin} · D-U-N-S: ${duns}`, margin, 287)
  doc.text(reference, pageW - margin, 282, { align: 'right' })
  doc.text('https://www.anjalsolutionsltd.com', pageW - margin, 287, { align: 'right' })

  return doc
}
