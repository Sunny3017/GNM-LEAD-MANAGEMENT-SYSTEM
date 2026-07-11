import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Helper to get nested values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : ''), obj);
};

// Export to PDF
export const exportToPDF = (data, columns, title, filename = 'export.pdf') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(56, 73, 89); // #384959
  doc.text(title, 14, 20);
  
  // Subtitle (current date)
  doc.setFontSize(10);
  doc.setTextColor(106, 137, 167); // #6A89A7
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Table
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => getNestedValue(row, col.key) || '')),
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [106, 137, 167], // #6A89A7
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [189, 221, 252], // #BDDDFC
    },
  });
  
  doc.save(filename);
};

// Export to Excel
export const exportToExcel = (data, columns, filename = 'export.xlsx') => {
  const worksheetData = [
    columns.map(col => col.header),
    ...data.map(row => columns.map(col => getNestedValue(row, col.key) || ''))
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  XLSX.writeFile(workbook, filename);
};
