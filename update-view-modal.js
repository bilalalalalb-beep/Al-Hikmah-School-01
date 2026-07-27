const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\view-student-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetFullName = "  const fullName = `${studentData.first_name} ${studentData.last_name || ''}`.trim();";
const replaceFullName = "  const fullName = `${studentData.first_name} ${studentData.last_name || ''}`.trim();\n  const fullNameEn = `${studentData.first_name_en || ''} ${studentData.last_name_en || ''}`.trim();";
if(content.includes(targetFullName)) content = content.replace(targetFullName, replaceFullName);

// Add English name under Urdu name
const targetTitle = `<DialogTitle className="text-xl font-bold flex items-center gap-2">\n              <User className="w-5 h-5 text-primary" />\n              {fullName}\n            </DialogTitle>`;
const replaceTitle = `<DialogTitle className="flex flex-col items-start gap-1">\n              <div className="text-xl font-bold flex items-center gap-2">\n                <User className="w-5 h-5 text-primary" />\n                {fullName}\n              </div>\n              {fullNameEn && <div className="text-sm font-normal text-muted-foreground ml-7 font-en">{fullNameEn}</div>}\n            </DialogTitle>`;
if(content.includes(targetTitle)) content = content.replace(targetTitle, replaceTitle);

// Add CNIC and Father Name En
const targetFather = `<InfoItem \n                  icon={<User className="w-4 h-4 text-blue-500" />}\n                  label={locale === 'ur' ? 'والد کا نام' : 'Father Name'}\n                  value={studentData.father_name}\n                />`;
const replaceFather = `<InfoItem \n                  icon={<User className="w-4 h-4 text-blue-500" />}\n                  label={locale === 'ur' ? 'والد کا نام' : 'Father Name'}\n                  value={studentData.father_name}\n                />\n                {studentData.father_name_en && <InfoItem \n                  icon={<User className="w-4 h-4 text-blue-500" />}\n                  label={locale === 'ur' ? 'والد (انگریزی)' : 'Father (En)'}\n                  value={studentData.father_name_en}\n                  valueClassName="font-en"\n                />}\n                {studentData.student_cnic && <InfoItem \n                  icon={<FileText className="w-4 h-4 text-slate-500" />}\n                  label={locale === 'ur' ? 'ب-فارم' : 'B-Form'}\n                  value={studentData.student_cnic}\n                  valueClassName="font-en"\n                />}`;
if(content.includes(targetFather)) content = content.replace(targetFather, replaceFather);

fs.writeFileSync(file, content, 'utf8');
console.log('View modal updated');
