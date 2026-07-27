const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\edit-student-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update reset()
const resetTarget = `      reset({
        firstName: studentData.first_name || '',
        lastName: studentData.last_name || '',`;
const resetReplacement = `      reset({
        firstName: studentData.first_name || '',
        firstNameEn: studentData.first_name_en || '',
        lastName: studentData.last_name || '',
        lastNameEn: studentData.last_name_en || '',`;
if(content.includes(resetTarget)) content = content.replace(resetTarget, resetReplacement);

const resetTarget2 = `        fatherName: studentData.father_name || '',
        fatherPhone: studentData.father_phone || '',`;
const resetReplacement2 = `        fatherName: studentData.father_name || '',
        fatherNameEn: studentData.father_name_en || '',
        studentCnic: studentData.student_cnic || '',
        fatherPhone: studentData.father_phone || '',`;
if(content.includes(resetTarget2)) content = content.replace(resetTarget2, resetReplacement2);

// Update submission payload
const payloadTarget = `        first_name: data.firstName,
        last_name: data.lastName || '',`;
const payloadReplacementText = `        first_name: data.firstName,
        first_name_en: data.firstNameEn || null,
        last_name: data.lastName || '',
        last_name_en: data.lastNameEn || null,`;
if(content.includes(payloadTarget)) content = content.replace(payloadTarget, payloadReplacementText);

const payloadTarget2 = `        father_name: data.fatherName,
        father_phone: data.fatherPhone,`;
const payloadReplacementText2 = `        father_name: data.fatherName,
        father_name_en: data.fatherNameEn || null,
        student_cnic: data.studentCnic || null,
        father_phone: data.fatherPhone,`;
if(content.includes(payloadTarget2)) content = content.replace(payloadTarget2, payloadReplacementText2);

// Update UI
const uiNameTarget = `            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'پہلا نام' : 'First Name'}</Label>
                <Input {...register('firstName')} className={\`h-10 text-xs font-ur \${errors.firstName ? "border-destructive" : ""}\`} />
                {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'آخری نام' : 'Last Name'}</Label>
                <Input {...register('lastName')} className="h-10 text-xs font-ur" />
              </div>
            </div>`;
const uiNameReplacement = `            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'پہلا نام (اردو)' : 'First Name (Urdu)'}</Label>
                <Input {...register('firstName')} className={\`h-10 text-xs font-ur \${errors.firstName ? "border-destructive" : ""}\`} />
                {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'پہلا نام (انگریزی)' : 'First Name (English)'}</Label>
                <Input {...register('firstNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'آخری نام (اردو)' : 'Last Name (Urdu)'}</Label>
                <Input {...register('lastName')} className="h-10 text-xs font-ur" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'آخری نام (انگریزی)' : 'Last Name (English)'}</Label>
                <Input {...register('lastNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>
            </div>`;
if(content.includes(uiNameTarget)) content = content.replace(uiNameTarget, uiNameReplacement);

const uiFatherTarget = `            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'والد کا نام' : 'Father Name'}</Label>
                <Input {...register('fatherName')} className="h-10 text-xs font-ur" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'والد کا رابطہ' : 'Father Phone'}</Label>
                <Input {...register('fatherPhone')} className="h-10 text-xs font-en text-start" />
              </div>
            </div>`;
const uiFatherReplacement = `            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'والد کا نام (اردو)' : 'Father Name (Urdu)'}</Label>
                <Input {...register('fatherName')} className="h-10 text-xs font-ur" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'والد کا نام (انگریزی)' : 'Father Name (English)'}</Label>
                <Input {...register('fatherNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>
                <Input {...register('studentCnic')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{locale === 'ur' ? 'والد کا رابطہ' : 'Father Phone'}</Label>
                <Input {...register('fatherPhone')} className="h-10 text-xs font-en text-start" />
              </div>
            </div>`;
if(content.includes(uiFatherTarget)) content = content.replace(uiFatherTarget, uiFatherReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Edit modal updated');
