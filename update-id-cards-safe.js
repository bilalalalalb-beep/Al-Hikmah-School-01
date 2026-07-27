const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add usePortalSettings import
if (!content.includes('usePortalSettings')) {
    content = content.replace(
        "import { useLanguage } from '@/lib/i18n/context';",
        "import { useLanguage } from '@/lib/i18n/context';\nimport { usePortalSettings } from '@/lib/settings/context';"
    );
}

// 2. Add settings, expiryDate, showStudentCnic states
if (!content.includes('const { settings } = usePortalSettings();')) {
    content = content.replace(
        "const { locale, dir } = useLanguage();",
        "const { locale, dir } = useLanguage();\n  const { settings } = usePortalSettings();\n  const [expiryDate, setExpiryDate] = useState('31-03-2027');\n  const [showStudentCnic, setShowStudentCnic] = useState(false);"
    );
}

// 3. Update getCardsDocument HTML
const getCardsStart = content.indexOf('  const getCardsDocument = (includePrintScript: boolean) => {');
const getCardsEnd = content.indexOf('  const handleBulkPrint = () => {');

if (getCardsStart !== -1 && getCardsEnd !== -1) {
    const oldGetCards = content.substring(getCardsStart, getCardsEnd);
    
    // We rewrite newGetCardsContent using normal strings to avoid any template literal escaping issues
    let newGetCardsContent = "  const getCardsDocument = (includePrintScript: boolean) => {\n" +
    "    let cardsHtml = '';\n" +
    "    \n" +
    "    const studentsToPrint = students.filter(s => selectedIds.has(s.id));\n" +
    "    \n" +
    "    studentsToPrint.forEach(student => {\n" +
    "      const fullName = `${student.first_name} ${student.last_name || ''}`.trim();\n" +
    "      const classNameStr = getClassName(student.current_class_id);\n" +
    "      \n" +
    "      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.registration_id}`;\n" +
    "      const photoUrl = student.photo_url || '';\n" +
    "      const photoHtml = photoUrl \n" +
    "        ? `<img src=\"${photoUrl}\" class=\"pt-photo\" />` \n" +
    "        : `<div class=\"pt-photo-placeholder\">👤</div>`;\n" +
    "\n" +
    "      const logoHtml = settings.logo \n" +
    "        ? `<img src=\"${settings.logo}\" style=\"width: 100%; height: 100%; object-fit: contain;\" />`\n" +
    "        : `<span style=\"font-size: 24px;\">🏫</span>`;\n" +
    "\n" +
    "      cardsHtml += `\n" +
    "        <div class=\"card-container portrait-card\" dir=\"rtl\">\n" +
    "          <!-- Top Section -->\n" +
    "          <div style=\"text-align: center; padding-top: 12px; position: relative; z-index: 1;\">\n" +
    "            <div style=\"width: 45px; height: 45px; margin: 0 auto; background-color: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; overflow: hidden;\">\n" +
    "              ${logoHtml}\n" +
    "            </div>\n" +
    "            <h2 style=\"font-size: 11px; font-weight: bold; color: #171f27; margin: 0; padding: 0 5px; line-height: 1.4;\">\n" +
    "              ${settings.madrasaNameUr || 'جامعہ الحکمہ الاسلامیہ و پبلک سکول'}\n" +
    "            </h2>\n" +
    "            <p style=\"font-size: 7px; font-weight: 500; color: #64748b; margin: 2px 0 0 0; font-family: 'Inter', sans-serif;\">\n" +
    "              ${settings.addressUr || 'نزد جامع مسجد بلال، چناب نگر'}\n" +
    "            </p>\n" +
    "          </div>\n" +
    "\n" +
    "          <!-- Profile Picture -->\n" +
    "          <div style=\"position: absolute; top: 34%; left: 50%; transform: translateX(-50%); width: 65px; height: 65px; border-radius: 50%; background-color: #ffffff; padding: 3px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10;\">\n" +
    "            ${photoHtml}\n" +
    "          </div>\n" +
    "\n" +
    "          <!-- Bottom Section (Triangle + Rectangle) -->\n" +
    "          <div style=\"position: absolute; bottom: 0; left: 0; right: 0; height: 52%; background-color: #171f27; clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 100%); display: flex; flex-direction: column; align-items: center; padding-top: 35px; color: #ffffff;\">\n" +
    "            <h3 style=\"font-size: 14px; font-weight: bold; margin: 0; line-height: 1.2;\">${fullName}</h3>\n" +
    "            <p style=\"font-size: 9px; font-weight: 500; margin: 2px 0 8px 0; color: #cbd5e1;\">${classNameStr}</p>\n" +
    "\n" +
    "            <!-- Info Grid -->\n" +
    "            <div style=\"width: 85%; font-size: 7px; display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; text-align: right;\">\n" +
    "              <div style=\"font-weight: bold; color: #94a3b8;\">آئی ڈی:</div>\n" +
    "              <div>${student.registration_id}</div>\n" +
    "              \n" +
    "              ${showStudentCnic ? `\n" +
    "                <div style=\"font-weight: bold; color: #94a3b8;\">ب فارم/CNIC:</div>\n" +
    "                <div style=\"font-family: 'Inter', sans-serif;\">${student.student_cnic || '---'}</div>\n" +
    "              ` : ''}\n" +
    "\n" +
    "              <div style=\"font-weight: bold; color: #94a3b8;\">والد:</div>\n" +
    "              <div>${student.father_name}</div>\n" +
    "              \n" +
    "              ${showFatherCnic ? `\n" +
    "                <div style=\"font-weight: bold; color: #94a3b8;\">والد CNIC:</div>\n" +
    "                <div style=\"font-family: 'Inter', sans-serif;\">${student.father_cnic_or_id || '---'}</div>\n" +
    "              ` : ''}\n" +
    "              \n" +
    "              ${showContact ? `\n" +
    "                <div style=\"font-weight: bold; color: #94a3b8;\">رابطہ:</div>\n" +
    "                <div style=\"font-family: 'Inter', sans-serif;\">${student.father_phone || '---'}</div>\n" +
    "              ` : ''}\n" +
    "              \n" +
    "              <div style=\"font-weight: bold; color: #94a3b8;\">پتہ:</div>\n" +
    "              <div>${student.residential_address || '---'}</div>\n" +
    "              \n" +
    "              ${expiryDate ? `\n" +
    "                <div style=\"font-weight: bold; color: #94a3b8;\">معیاد:</div>\n" +
    "                <div style=\"font-family: 'Inter', sans-serif;\">${expiryDate}</div>\n" +
    "              ` : ''}\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- QR Code -->\n" +
    "            <div style=\"position: absolute; bottom: 8px; left: 8px; background-color: #fff; padding: 2px; border-radius: 4px; width: 30px; height: 30px;\">\n" +
    "              <img src=\"${qrCodeUrl}\" style=\"width: 100%; height: 100%; display: block;\" />\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      `;\n" +
    "    });\n" +
    "\n" +
    "    return `\n" +
    "      <!DOCTYPE html>\n" +
    "      <html lang=\"ur\" dir=\"rtl\">\n" +
    "      <head>\n" +
    "        <meta charset=\"UTF-8\">\n" +
    "        <title>Bulk_ID_Cards</title>\n" +
    "        <style>\n" +
    "          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700;800&display=swap');\n" +
    "          \n" +
    "          @page { size: A4; margin: 10mm; }\n" +
    "          * { box-sizing: border-box; }\n" +
    "          body { \n" +
    "            font-family: 'Noto Nastaliq Urdu', 'Inter', sans-serif; \n" +
    "            margin: 0;\n" +
    "            background-color: #ffffff;\n" +
    "            -webkit-print-color-adjust: exact;\n" +
    "            print-color-adjust: exact;\n" +
    "          }\n" +
    "          .cards-grid {\n" +
    "            display: grid;\n" +
    "            grid-template-columns: repeat(3, 1fr);\n" +
    "            gap: 15px;\n" +
    "            padding: 20px;\n" +
    "          }\n" +
    "          \n" +
    "          .card-container {\n" +
    "            position: relative;\n" +
    "            background-color: #ffffff;\n" +
    "            border: 1px solid #e2e8f0;\n" +
    "            overflow: hidden;\n" +
    "            break-inside: avoid;\n" +
    "            page-break-inside: avoid;\n" +
    "          }\n" +
    "          \n" +
    "          .portrait-card {\n" +
    "            width: 54mm;\n" +
    "            height: 86mm;\n" +
    "            margin: 0 auto;\n" +
    "          }\n" +
    "\n" +
    "          .pt-photo {\n" +
    "            width: 100%;\n" +
    "            height: 100%;\n" +
    "            border-radius: 50%;\n" +
    "            object-fit: cover;\n" +
    "          }\n" +
    "          \n" +
    "          .pt-photo-placeholder {\n" +
    "            width: 100%;\n" +
    "            height: 100%;\n" +
    "            border-radius: 50%;\n" +
    "            background-color: #e2e8f0;\n" +
    "            display: flex;\n" +
    "            align-items: center;\n" +
    "            justify-content: center;\n" +
    "            color: #94a3b8;\n" +
    "            font-size: 20px;\n" +
    "          }\n" +
    "\n" +
    "          @media print {\n" +
    "            body { background-color: white; }\n" +
    "            .cards-grid { padding: 0; gap: 5px; }\n" +
    "            * {\n" +
    "              -webkit-print-color-adjust: exact !important;\n" +
    "              print-color-adjust: exact !important;\n" +
    "            }\n" +
    "          }\n" +
    "        </style>\n" +
    "      </head>\n" +
    "      <body>\n" +
    "        <div class=\"cards-grid\">\n" +
    "          ${cardsHtml}\n" +
    "        </div>\n" +
    "        ${includePrintScript ? `<script>\n" +
    "          document.fonts.ready.then(() => {\n" +
    "             setTimeout(() => { window.print(); }, 1000);\n" +
    "          });\n" +
    "        </script>` : ''}\n" +
    "      </body>\n" +
    "      </html>\n" +
    "    `;\n" +
    "  };\n\n";
    
    content = content.replace(oldGetCards, newGetCardsContent);
}

// 4. Update the settings UI panel
const oldUIBlock = "                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'رابطہ نمبر' : 'Phone Number'}</Label>\n" +
"                    <Switch checked={showContact} onCheckedChange={setShowContact} />\n" +
"                  </div>\n" +
"                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'بلڈ گروپ' : 'Blood Group'}</Label>\n" +
"                    <Switch checked={showBloodGroup} onCheckedChange={setShowBloodGroup} />\n" +
"                  </div>\n" +
"                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>\n" +
"                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />\n" +
"                  </div>";

const newUIBlock = "                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'رابطہ نمبر' : 'Phone Number'}</Label>\n" +
"                    <Switch checked={showContact} onCheckedChange={setShowContact} />\n" +
"                  </div>\n" +
"                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'طالب علم کا ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>\n" +
"                    <Switch checked={showStudentCnic} onCheckedChange={setShowStudentCnic} />\n" +
"                  </div>\n" +
"                  <div className=\"flex items-center justify-between\">\n" +
"                    <Label className=\"text-xs text-slate-600\">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>\n" +
"                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />\n" +
"                  </div>\n" +
"                  <div className=\"pt-2 border-t border-slate-100\">\n" +
"                    <Label className=\"text-xs text-slate-600 mb-2 block\">{locale === 'ur' ? 'کارڈ کی ایکسپائری تاریخ' : 'Card Expiry Date'}</Label>\n" +
"                    <Input \n" +
"                      value={expiryDate}\n" +
"                      onChange={(e) => setExpiryDate(e.target.value)}\n" +
"                      placeholder=\"e.g. 31-03-2027\"\n" +
"                      className=\"text-xs h-8\"\n" +
"                    />\n" +
"                  </div>";

content = content.replace(oldUIBlock, newUIBlock);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated id-cards-desk.tsx');
