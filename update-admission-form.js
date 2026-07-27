const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\admission-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update the payload sent to Supabase
const payloadStartStr = "        first_name: data.firstName,\n        last_name: data.lastName || '',";
const payloadReplacement = "        first_name: data.firstName,\n        first_name_en: data.firstNameEn || null,\n        last_name: data.lastName || '',\n        last_name_en: data.lastNameEn || null,";
content = content.replace(payloadStartStr, payloadReplacement);

const payloadEndStr = "        father_name: data.fatherName,\n        father_phone: data.fatherPhone,";
const payloadEndReplacement = "        father_name: data.fatherName,\n        father_name_en: data.fatherNameEn || null,\n        student_cnic: data.studentCnic || null,\n        father_phone: data.fatherPhone,";
content = content.replace(payloadEndStr, payloadEndReplacement);

// 2. Add inputs to the UI
const nameBlockTarget = `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold">{locale === 'ur' ? 'اسمِ گرامی (پہلا نام) *' : 'First Name *'}</Label>
                  <Input 
                    id="firstName" 
                    placeholder={locale === 'ur' ? 'مثلاً: محمد' : 'e.g. Muhammad'} 
                    {...register('firstName')} 
                    className={\`h-10 text-xs font-ur \${errors.firstName ? "border-destructive" : ""}\`}
                  />
                  {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold">{locale === 'ur' ? 'آخری نام / عرفیت' : 'Last Name / Surname'}</Label>
                  <Input id="lastName" placeholder={locale === 'ur' ? 'مثلاً: علی / خان' : 'e.g. Ali / Khan'} {...register('lastName')} className="h-10 text-xs font-ur" />
                </div>
              </div>`;

const nameBlockNew = `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold">{locale === 'ur' ? 'اسمِ گرامی (اردو) *' : 'First Name (Urdu) *'}</Label>
                  <Input 
                    id="firstName" 
                    placeholder={locale === 'ur' ? 'مثلاً: محمد' : 'e.g. Muhammad'} 
                    {...register('firstName')} 
                    className={\`h-10 text-xs font-ur \${errors.firstName ? "border-destructive" : ""}\`}
                  />
                  {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstNameEn" className="text-xs font-bold">{locale === 'ur' ? 'پہلا نام (انگریزی)' : 'First Name (English)'}</Label>
                  <Input id="firstNameEn" placeholder="e.g. Muhammad" {...register('firstNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold">{locale === 'ur' ? 'آخری نام / عرفیت (اردو)' : 'Last Name (Urdu)'}</Label>
                  <Input id="lastName" placeholder={locale === 'ur' ? 'مثلاً: علی / خان' : 'e.g. Ali / Khan'} {...register('lastName')} className="h-10 text-xs font-ur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastNameEn" className="text-xs font-bold">{locale === 'ur' ? 'آخری نام (انگریزی)' : 'Last Name (English)'}</Label>
                  <Input id="lastNameEn" placeholder="e.g. Ali" {...register('lastNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
                </div>
              </div>`;

if(content.includes(nameBlockTarget)) {
    content = content.replace(nameBlockTarget, nameBlockNew);
} else {
    // try looser matching
    const looseTarget = content.substring(content.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">'), content.indexOf('</div>\n              </div>') + 18);
    // this might be risky, but let's try replacing by index
    console.error("Could not find exact name block target in admission-form");
}

const fatherBlockTarget = `              <div className="space-y-2">
                <Label htmlFor="fatherName" className="text-xs font-bold">{locale === 'ur' ? 'والد / سرپرست کا نام *' : 'Father / Guardian Name *'}</Label>
                <Input id="fatherName" placeholder={locale === 'ur' ? 'مثلاً: عبدالرحمٰن' : 'e.g. Abdul Rahman'} {...register('fatherName')} className="h-10 text-xs font-ur" />
                {errors.fatherName && <p className="text-[11px] text-destructive">{errors.fatherName.message}</p>}
              </div>`;

const fatherBlockNew = `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-xs font-bold">{locale === 'ur' ? 'والد کا نام (اردو) *' : 'Father Name (Urdu) *'}</Label>
                  <Input id="fatherName" placeholder={locale === 'ur' ? 'مثلاً: عبدالرحمٰن' : 'e.g. Abdul Rahman'} {...register('fatherName')} className="h-10 text-xs font-ur" />
                  {errors.fatherName && <p className="text-[11px] text-destructive">{errors.fatherName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherNameEn" className="text-xs font-bold">{locale === 'ur' ? 'والد کا نام (انگریزی)' : 'Father Name (English)'}</Label>
                  <Input id="fatherNameEn" placeholder="e.g. Abdul Rahman" {...register('fatherNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
                </div>
              </div>`;

if(content.includes(fatherBlockTarget)) {
    content = content.replace(fatherBlockTarget, fatherBlockNew);
}

// Student CNIC insertion
const dobTarget = `              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-xs font-bold">{locale === 'ur' ? 'تاریخِ پیدائش' : 'Date of Birth'}</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className="h-10 text-xs" />
              </div>`;

const dobNew = `              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-xs font-bold">{locale === 'ur' ? 'تاریخِ پیدائش' : 'Date of Birth'}</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className="h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentCnic" className="text-xs font-bold">{locale === 'ur' ? 'ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>
                <Input id="studentCnic" placeholder="35201-1234567-1" {...register('studentCnic')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>`;

if(content.includes(dobTarget)) {
    content = content.replace(dobTarget, dobNew);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Admission form updated');
