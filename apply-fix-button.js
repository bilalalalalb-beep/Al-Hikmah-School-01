const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetButton = `          <Button 
            variant="outline"
            onClick={handleDownloadHtmlPdf} 
            disabled={selectedIds.size === 0 || isGeneratingPdf}
            className="w-full md:w-auto h-12 px-6 font-bold text-teal-700 gap-2 border-teal-200 bg-teal-50 hover:bg-teal-100 shadow-sm"
          >
            {isGeneratingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isGeneratingPdf 
              ? (locale === 'ur' ? 'ڈاؤنلوڈ ہو رہا ہے...' : 'Downloading...') 
              : (locale === 'ur' ? 'کارڈز ڈاؤنلوڈ' : 'Download Cards')
            }
          </Button>`;

const replacementButton = `          <Button 
            variant="outline"
            onClick={handleDownloadHtmlPdf} 
            disabled={selectedIds.size === 0}
            className="w-full md:w-auto h-12 px-6 font-bold text-teal-700 gap-2 border-teal-200 bg-teal-50 hover:bg-teal-100 shadow-sm"
          >
            <Download className="w-5 h-5" />
            {locale === 'ur' ? 'کارڈز ڈاؤنلوڈ (PDF)' : 'Download PDF'}
          </Button>`;

content = content.replace(targetButton, replacementButton);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed button JSX');
