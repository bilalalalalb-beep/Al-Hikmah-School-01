const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'رابطہ نمبر' : 'Phone Number'}</Label>
                    <Switch checked={showContact} onCheckedChange={setShowContact} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'بلڈ گروپ' : 'Blood Group'}</Label>
                    <Switch checked={showBloodGroup} onCheckedChange={setShowBloodGroup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>
                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />
                  </div>`;

const replaceStr = `                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'رابطہ نمبر' : 'Phone Number'}</Label>
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
                  </div>`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed UI toggles');
