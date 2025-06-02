import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratePDFService {

  constructor(private notifier:NotificationService) { }

  generatePdf(elementId: string, fileName: string): void {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }

    html2canvas(element, { scale: 2, useCORS: true })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 190; // A4 width
        const pageHeight = 297; // A4 height
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margin = 10;
        let heightLeft = imgHeight;
        let position = margin;

        const footerText = "Black Sarl 2025";
        // const footerText = "";

        // Add the first page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        this.addFooter(pdf, footerText, pageHeight, margin);
        heightLeft -= (pageHeight - margin * 2);

        // Handle additional pages
        while (heightLeft >= 0) {
          position = margin - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          this.addFooter(pdf, footerText, pageHeight, margin);
          heightLeft -= (pageHeight - margin * 2);
        }

        // Save the PDF
        pdf.save(fileName);
        this.notifier.onSuccess('PDF generated successfully');
      })
      .catch(error => {
        this.notifier.onError('Error generating PDF');
        console.error('Error generating PDF:', error);
      });
  }

  addFooter(pdf: jsPDF, text: string, pageHeight: number, margin: number): void {
    pdf.setFontSize(9);
    pdf.setTextColor(3, 3, 3);
    pdf.setFont("helvetica", "bold");
    const footerX = margin; // Adjust the X coordinate as needed
    const footerY = pageHeight - 10; // Adjust Y position
    const footerWidth = pdf.internal.pageSize.width - 2 * margin; // Calculate footer width
    pdf.text(text, footerX, footerY, { maxWidth: footerWidth, align: 'left' });
  }
}
