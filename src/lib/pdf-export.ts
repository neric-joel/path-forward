import type { AssessmentResult } from './types';
import type { ScoreState } from './score-engine';

// Dynamic import to keep bundle lean
async function getJsPDF() {
  const { jsPDF } = await import('jspdf');
  return jsPDF;
}

const TEAL: [number, number, number] = [15, 110, 86];
const AMBER: [number, number, number] = [186, 117, 23];
const DARK: [number, number, number] = [28, 28, 26];
const GRAY: [number, number, number] = [107, 106, 101];
const LIGHT: [number, number, number] = [242, 240, 235];

function addPageHeader(doc: InstanceType<Awaited<ReturnType<typeof getJsPDF>>>, pageNum: number) {
  if (pageNum > 1) {
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, 210, 10, 'F');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Vazhi வழி · Your College Readiness Plan', 10, 6.5);
    doc.text(`Page ${pageNum}`, 200, 6.5, { align: 'right' });
  }
}

export async function exportToPDF(
  result: AssessmentResult,
  scores: ScoreState
): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;
  let pageNum = 1;

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > 275) {
      doc.addPage();
      pageNum++;
      addPageHeader(doc, pageNum);
      y = pageNum > 1 ? 18 : 0;
    }
  };

  // ── Cover / Header ─────────────────────────────────────────────────────
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 55, 'F');

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Your College Readiness Plan', margin, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 230, 222);
  doc.text('Vazhi வழி · Powered by AI · Verified with Arizona Program Data', margin, 30);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.text(`Generated: ${today}`, margin, 37);

  // Privacy note
  doc.setFontSize(7);
  doc.setTextColor(180, 210, 200);
  doc.text('This plan was generated in your browser. No personal data was stored or shared.', margin, 48);

  y = 63;

  // ── Key Insight ────────────────────────────────────────────────────────
  doc.setFillColor(...AMBER);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('KEY INSIGHT', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const insightLines = doc.splitTextToSize(result.key_insight, contentW - 8);
  doc.text(insightLines.slice(0, 1), margin + 4, y + 11);
  y += 22;

  // ── Readiness Scores ───────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Readiness Scores', margin, y);
  y += 6;

  doc.setFillColor(...LIGHT);
  doc.roundedRect(margin, y, contentW, 40, 3, 3, 'F');

  const scoreItems = [
    { label: 'Overall', value: scores.overall },
    { label: 'Academic', value: scores.academic },
    { label: 'Financial Aid', value: scores.financial_aid },
    { label: 'Applications', value: scores.application },
    { label: 'Timeline', value: scores.timeline },
  ];

  const colW = contentW / scoreItems.length;
  scoreItems.forEach((item, i) => {
    const cx = margin + i * colW + colW / 2;

    // Score circle (simplified)
    const scoreColor: [number, number, number] = item.value >= 75 ? [59, 109, 17] :
      item.value >= 50 ? TEAL :
      item.value >= 30 ? AMBER : [216, 90, 48];
    doc.setDrawColor(...scoreColor);
    doc.setLineWidth(1.5);
    doc.circle(cx, y + 14, 8, 'D');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...scoreColor);
    doc.text(String(item.value), cx, y + 16.5, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(item.label, cx, y + 27, { align: 'center' });

    // Score bar
    const barW = colW - 10;
    const barX = cx - barW / 2;
    doc.setFillColor(220, 215, 205);
    doc.rect(barX, y + 30, barW, 2, 'F');
    doc.setFillColor(...scoreColor);
    doc.rect(barX, y + 30, barW * (item.value / 100), 2, 'F');
  });
  y += 48;

  // Summary
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...GRAY);
  const summaryLines = doc.splitTextToSize(result.readiness.overall_summary, contentW);
  doc.text(summaryLines.slice(0, 2), margin, y);
  y += summaryLines.slice(0, 2).length * 4.5 + 6;

  // ── Matched Programs ───────────────────────────────────────────────────
  checkNewPage(30);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Your Matched Funding', margin, y);
  y += 7;

  result.matched_programs.forEach(program => {
    checkNewPage(38);

    const confColor: [number, number, number] = program.confidence === 'eligible' ? [59, 109, 17] :
      program.confidence === 'likely_eligible' ? TEAL : AMBER;

    doc.setFillColor(248, 246, 241);
    doc.roundedRect(margin, y, contentW, 32, 2, 2, 'F');

    // Program name + amount
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(program.name, margin + 4, y + 7);

    doc.setFontSize(9);
    doc.setTextColor(...TEAL);
    doc.setFont('helvetica', 'bold');
    doc.text(program.max_amount, margin + 4, y + 13);

    // Confidence badge
    doc.setFillColor(...confColor);
    const badgeLabel = program.confidence.replace('_', ' ').toUpperCase();
    doc.roundedRect(pageW - margin - 35, y + 3, 33, 6, 1.5, 1.5, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(badgeLabel, pageW - margin - 35 + 16.5, y + 7.2, { align: 'center' });

    // Coverage + next action
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    const coverLines = doc.splitTextToSize(program.what_it_covers, contentW - 10);
    doc.text(coverLines.slice(0, 1), margin + 4, y + 19);

    doc.setTextColor(...DARK);
    const actionLines = doc.splitTextToSize(`→ ${program.next_action}`, contentW - 10);
    doc.text(actionLines.slice(0, 1), margin + 4, y + 25);

    // Source
    doc.setFontSize(6.5);
    doc.setTextColor(...TEAL);
    doc.text(program.source_url, margin + 4, y + 30);

    y += 37;
  });

  // ── Action Plan ────────────────────────────────────────────────────────
  checkNewPage(20);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text('Your Action Plan', margin, y);
  y += 7;

  result.action_plan.forEach(step => {
    const baseH = 45;
    const docsNeeded = step.documents_needed.filter(d => d.status === 'need');
    const estimatedH = baseH + docsNeeded.length * 6;
    checkNewPage(estimatedH);

    // Step header background
    doc.setFillColor(...TEAL);
    doc.rect(margin, y, contentW, 9, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP ${step.step_number}  ·  ${step.title.toUpperCase()}`, margin + 4, y + 6);

    // Confidence
    const confLabel = step.confidence.toUpperCase();
    doc.setFontSize(7);
    doc.text(confLabel, pageW - margin - 4, y + 6, { align: 'right' });

    y += 11;

    // Body
    doc.setFillColor(248, 246, 241);
    const bodyH = estimatedH - 11;
    doc.rect(margin, y, contentW, bodyH, 'F');

    let innerY = y + 5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...GRAY);
    const whyLines = doc.splitTextToSize(step.why_this_is_next, contentW - 8);
    doc.text(whyLines.slice(0, 2), margin + 4, innerY);
    innerY += whyLines.slice(0, 2).length * 4 + 3;

    // What to do
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text('What to do:', margin + 4, innerY);
    innerY += 4;
    doc.setFont('helvetica', 'normal');
    const actionLines = doc.splitTextToSize(step.specific_action, contentW - 8);
    doc.text(actionLines.slice(0, 2), margin + 4, innerY);
    innerY += actionLines.slice(0, 2).length * 4 + 2;

    // Where + deadline on one line
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(`Where: ${step.where_to_go}`, margin + 4, innerY);
    innerY += 4;

    if (step.deadline) {
      doc.setTextColor(step.days_until_deadline && step.days_until_deadline <= 14 ? 216 : 107,
        step.days_until_deadline && step.days_until_deadline <= 14 ? 90 : 106,
        step.days_until_deadline && step.days_until_deadline <= 14 ? 48 : 101);
      doc.text(`Deadline: ${step.deadline}`, margin + 4, innerY);
      innerY += 4;
    }

    // Docs needed
    if (docsNeeded.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...DARK);
      doc.text('Documents to get:', margin + 4, innerY);
      innerY += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...GRAY);
      docsNeeded.slice(0, 3).forEach(d => {
        doc.text(`• ${d.name}: ${d.how_to_get}`, margin + 6, innerY);
        innerY += 4;
      });
    }

    // Source
    doc.setFontSize(6.5);
    doc.setTextColor(...TEAL);
    doc.text(step.source_url, margin + 4, y + bodyH - 4);

    y += bodyH + 4;
  });

  // ── Footer ─────────────────────────────────────────────────────────────
  checkNewPage(20);
  y += 4;
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...GRAY);
  doc.text(
    'This plan is a navigation guide, not legal or financial advice. Always verify eligibility with program offices.',
    pageW / 2, y, { align: 'center' }
  );
  y += 4;
  doc.text('Vazhi வழி · vazhi.app · Built for foster youth in Arizona', pageW / 2, y, { align: 'center' });

  doc.save('vazhi-college-plan.pdf');
}
