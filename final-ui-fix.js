const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStart = content.indexOf('<div className="space-y-3 border-t pt-4">');
const targetEnd = content.indexOf('</CardContent>', targetStart);

if (targetStart !== -1 && targetEnd !== -1) {
    const originalBlock = content.substring(targetStart, targetEnd);
    
    // We are replacing everything from `<div className="space-y-3 border-t pt-4">` up to `</CardContent>`
    const newBlock = `<div className="space-y-3 border-t pt-4">
                <Label className="font-bold flex items-center gap-2 text-slate-700">{locale === 'ur' ? 'معلومات کا انتخاب' : 'Information to Display'}</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between pb-2">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'کارڈ کی زبان' : 'Card Language'}</Label>
                    <Select value={cardLanguage} onValueChange={(val: any) => setCardLanguage(val)}>
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'رابطہ نمبر' : 'Contact Number'}</Label>
                    <Switch checked={showContact} onCheckedChange={setShowContact} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>
                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'طالب علم کا ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>
                    <Switch checked={showStudentCnic} onCheckedChange={setShowStudentCnic} />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Label className="text-xs text-slate-600 mb-2 block">{locale === 'ur' ? 'کارڈ کی ایکسپائری تاریخ' : 'Card Expiry Date'}</Label>
                    <Input 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="e.g. 31-03-2027"
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>

            `;
            
    content = content.replace(originalBlock, newBlock);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully injected UI components!');
} else {
    console.error('Could not find block boundaries');
}
