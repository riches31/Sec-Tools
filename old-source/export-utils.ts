// Export utilities for Security Tools Suite
// Handles PDF and JSON export functionality

interface ExportData {
  toolName: string;
  timestamp: string;
  data: any;
  summary?: string;
}

/**
 * Export data as JSON file
 */
export function exportAsJSON(data: ExportData): void {
  const jsonData = {
    ...data,
    exportedAt: new Date().toISOString(),
    version: '1.0',
    source: 'Security Tools Suite'
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.toolName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV (for tabular data)
 */
export function exportAsCSV(headers: string[], rows: string[][], filename: string): void {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export as PDF using jsPDF (loaded via CDN in HTML)
 * Note: This requires jsPDF to be loaded via CDN script tag
 */
export async function exportAsPDF(data: ExportData): Promise<void> {
  // Check if jsPDF is available
  if (typeof window === 'undefined' || !(window as any).jspdf) {
    alert('PDF export is not available. Please ensure jsPDF library is loaded.');
    return;
  }

  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(14, 116, 144); // Cyan color
  doc.text('Security Tools Suite', margin, yPosition);

  yPosition += 10;
  doc.setFontSize(16);
  doc.setTextColor(51, 65, 85); // Slate color
  doc.text(data.toolName, margin, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);

  // Line separator
  yPosition += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Summary if provided
  if (data.summary) {
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text('Summary:', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;
  }

  // Data section
  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text('Report Data:', margin, yPosition);
  yPosition += 10;

  // Convert data object to readable format
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const dataStr = JSON.stringify(data.data, null, 2);
  const dataLines = doc.splitTextToSize(dataStr, pageWidth - 2 * margin);

  dataLines.forEach((line: string) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 4;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Security Tools Suite | Page ${i} of ${totalPages} | https://yoursite.com`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`${data.toolName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
