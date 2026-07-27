const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add showExpiryDate state
if (!content.includes('showExpiryDate')) {
    content = content.replace(
        "const [expiryDate, setExpiryDate] = useState('31-03-2027');",
        "const [expiryDate, setExpiryDate] = useState('31-03-2027');\n  const [showExpiryDate, setShowExpiryDate] = useState(true);"
    );
}

// 2. Add showExpiryDate to the UI toggles
const targetUI = `<div className="pt-2 border-t border-slate-100">
                    <Label className="text-xs text-slate-600 mb-2 block">{locale === 'ur' ? 'کارڈ کی ایکسپائری تاریخ' : 'Card Expiry Date'}</Label>
                    <Input 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="e.g. 31-03-2027"
                      className="text-xs h-8"
                    />
                  </div>`;

const newUI = `<div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'ایکسپائری دکھائیں' : 'Show Expiry Date'}</Label>
                    <Switch checked={showExpiryDate} onCheckedChange={setShowExpiryDate} />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Label className="text-xs text-slate-600 mb-2 block">{locale === 'ur' ? 'کارڈ کی ایکسپائری تاریخ' : 'Card Expiry Date'}</Label>
                    <Input 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="e.g. 31-03-2027"
                      className="text-xs h-8"
                      disabled={!showExpiryDate}
                    />
                  </div>`;

if (content.includes(targetUI)) {
    content = content.replace(targetUI, newUI);
}

// 3. Fix Photo position (top: 34% -> top: 29%)
content = content.replace('top: 34%;', 'top: 29%;');
// Make the bottom section slightly taller maybe? Or just reduce padding.
// "padding-top: 35px;" -> "padding-top: 32px;"
content = content.replace('padding-top: 35px;', 'padding-top: 30px;');
// "height: 52%;" -> "height: 56%;"
content = content.replace('height: 52%;', 'height: 55%;');

// 4. Update the Expiry Date condition in getCardsDocument
// from: `${expiryDate ? `
// to:   `${showExpiryDate && expiryDate ? `
content = content.replace('${expiryDate ? `', '${showExpiryDate && expiryDate ? `');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed photo alignment and expiry toggle!');
