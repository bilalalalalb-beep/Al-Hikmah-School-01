import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IdCardTemplate } from '@/components/students/id-card-template';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  registration_id: string;
  father_name: string;
  father_phone: string;
  blood_group: string;
  father_cnic_or_id: string;
  current_class_id: string;
  photo_url?: string;
  is_orphan?: boolean;
}

export const generatePdfIdCards = async (
  students: Student[],
  schoolName: string,
  schoolAddress: string,
  showContact: boolean,
  showBloodGroup: boolean,
  showFatherCnic: boolean,
  getClassName: (id: string) => string
) => {
  // Create a hidden container for rendering the React components
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [54, 86], // CR80 Standard ID Card format
  });

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    // We need a specific wrapper for each card to capture it
    const cardWrapper = document.createElement('div');
    container.appendChild(cardWrapper);
    const root = createRoot(cardWrapper);

    // Render the component
    await new Promise<void>((resolve) => {
      root.render(
        <IdCardTemplate
          student={student}
          schoolName={schoolName}
          schoolAddress={schoolAddress}
          classNameStr={getClassName(student.current_class_id)}
          showContact={showContact}
          showBloodGroup={showBloodGroup}
          showFatherCnic={showFatherCnic}
        />
      );
      // Wait for rendering to complete
      setTimeout(resolve, 300);
    });

    // Capture with html2canvas
    // Scale 3 provides excellent print quality
    const canvas = await html2canvas(cardWrapper.firstElementChild as HTMLElement, {
      scale: 3,
      useCORS: true, // For loading external images (profile photos)
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // WORKAROUND for html2canvas RTL bug:
        // Force the cloned document to LTR so html2canvas doesn't apply its flawed RTL text shaping.
        clonedDoc.documentElement.dir = 'ltr';
        clonedDoc.body.dir = 'ltr';
        
        // Remove dir="rtl" from the cloned card element itself
        const rtlElements = clonedDoc.querySelectorAll('[dir="rtl"]');
        rtlElements.forEach(el => {
          el.setAttribute('dir', 'ltr');
          (el as HTMLElement).style.direction = 'ltr';
          // Ensure text stays right aligned
          (el as HTMLElement).style.textAlign = 'right';
        });
      }
    });

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      doc.addPage();
    }
    
    // Add image to PDF (0, 0 position, 54x86mm size)
    doc.addImage(imgData, 'PNG', 0, 0, 54, 86);

    // Cleanup
    root.unmount();
    container.removeChild(cardWrapper);
  }

  // Final cleanup
  document.body.removeChild(container);

  // Download the PDF
  doc.save(`ID_Cards_${new Date().getTime()}.pdf`);
};
