const fs = require('fs');

const path = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove generatePdfIdCards import
content = content.replace("import { generatePdfIdCards } from '@/lib/pdf-utils';\n", "");

// 2. Replace getCardsDocument entirely
const getCardsDocumentRegex = /const getCardsDocument = \([\s\S]*?return `[\s\S]*?<\/html>\n\s*`;\n  };/;

const newGetCardsDocument = `const getCardsDocument = () => {
    let cardsHtml = '';
    
    // Process selected students
    const studentsToPrint = students.filter(s => selectedIds.has(s.id));
    
    studentsToPrint.forEach(student => {
      const fullName = \`\${student.first_name} \${student.last_name || ''}\`.trim();
      const classNameStr = getClassName(student.current_class_id);
      
      const qrCodeUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=\${student.registration_id}\`;
      const photoUrl = student.photo_url || '';
      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" class="pt-photo" />\` 
        : \`<div class="pt-photo-placeholder">👤</div>\`;

      cardsHtml += \`
        <div class="card-container portrait-card" dir="rtl">
          <!-- Top Section -->
          <div style="text-align: center; padding-top: 12px; position: relative; z-index: 1;">
            <div style="width: 45px; height: 45px; margin: 0 auto; background-color: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
              <span style="font-size: 24px;">🏫</span>
            </div>
            <h2 style="font-size: 11px; font-weight: bold; color: #171f27; margin: 0; padding: 0 5px; line-height: 1.4;">
              جامعہ الحکمہ الاسلامیہ و پبلک سکول
            </h2>
            <p style="font-size: 7px; font-weight: 500; color: #64748b; margin: 2px 0 0 0; font-family: 'Inter', sans-serif;">
              نزد جامع مسجد بلال، چناب نگر
            </p>
          </div>

          <!-- Profile Picture -->
          <div style="position: absolute; top: 34%; left: 50%; transform: translateX(-50%); width: 65px; height: 65px; border-radius: 50%; background-color: #ffffff; padding: 3px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10;">
            \${photoHtml}
          </div>

          <!-- Bottom Section (Triangle + Rectangle) -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 52%; background-color: #171f27; clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 100%); display: flex; flex-direction: column; align-items: center; padding-top: 35px; color: #ffffff;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0; line-height: 1.2;">\${fullName}</h3>
            <p style="font-size: 9px; font-weight: 500; margin: 2px 0 8px 0; color: #cbd5e1;">\${classNameStr}</p>

            <!-- Info Grid -->
            <div style="width: 85%; font-size: 7px; display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; text-align: right;">
              <div style="font-weight: bold; color: #94a3b8;">آئی ڈی:</div>
              <div>\${student.registration_id}</div>
              
              <div style="font-weight: bold; color: #94a3b8;">والد:</div>
              <div>\${student.father_name}</div>
              
              \${showContact ? \`
                <div style="font-weight: bold; color: #94a3b8;">رابطہ:</div>
                <div style="font-family: 'Inter', sans-serif;">\${student.father_phone || '---'}</div>
              \` : ''}
              
              <div style="font-weight: bold; color: #94a3b8;">پتہ:</div>
              <div>\${student.residential_address || '---'}</div>
            </div>

            <!-- QR Code -->
            <div style="position: absolute; bottom: 8px; left: 8px; background-color: #fff; padding: 2px; border-radius: 4px; width: 30px; height: 30px;">
              <img src="\${qrCodeUrl}" style="width: 100%; height: 100%; display: block;" />
            </div>
          </div>
        </div>
      \`;
    });

    return \`
      <!DOCTYPE html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>Bulk_ID_Cards</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700;800&display=swap');
          
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: 'Noto Nastaliq Urdu', 'Inter', sans-serif; 
            margin: 0;
            background-color: #f8fafc;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 20px;
          }
          
          .card-container {
            position: relative;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .portrait-card {
            width: 54mm;
            height: 86mm;
            margin: 0 auto;
          }

          .pt-photo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          
          .pt-photo-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 20px;
          }

          @media print {
            body { background-color: white; }
            .cards-grid { padding: 0; gap: 5px; }
            /* Ensure background colors print correctly */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="cards-grid">
          \${cardsHtml}
        </div>
        <script>
          // Automatically open print dialog when ready
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    \`;
  };`;

content = content.replace(getCardsDocumentRegex, newGetCardsDocument);

// 3. Replace handleDownloadHtmlPdf to just use handleBulkPrint logic since window.print() can "Save as PDF"
const handleDownloadRegex = /const handleDownloadHtmlPdf = async \(\) => \{([\s\S]*?)\} finally \{\n      setIsGeneratingPdf\(false\);\n    \}\n  \};/;
const newHandleDownload = `const handleDownloadHtmlPdf = () => {
    handleBulkPrint();
  };`;

content = content.replace(handleDownloadRegex, newHandleDownload);

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully refactored id-cards-desk.tsx for native printing");
