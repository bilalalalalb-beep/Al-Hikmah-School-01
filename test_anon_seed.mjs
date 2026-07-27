import { createClient } from '@supabase/supabase-js';

const url = 'https://xkrvidmepphwebewetjg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcnZpZG1lcHBod2ViZXdldGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNTEyNDQsImV4cCI6MjEwMDYyNzI0NH0.AZKkgZjIENnPfGWetrki_i_btCWJLRTE8Sx7tUBP1w4';

const supabase = createClient(url, key);

async function testAnonSeed() {
  console.log("Testing anon insert into classes...");
  const realClasses = [
    {
      id: '11111111-1111-1111-1111-111111111101',
      name_ur: 'قاعدہ (شعبہ حفظ و ناظرہ)',
      name_en: 'Qaida (Basics)',
      level_type: 'hifz',
      capacity: 40
    },
    {
      id: '11111111-1111-1111-1111-111111111105',
      name_ur: 'درجہ اولیٰ (عامہ اولیٰ)',
      name_en: 'Ula (Year 1 Alimiyah)',
      level_type: 'dars_nizami',
      capacity: 50
    },
    {
      id: '11111111-1111-1111-1111-111111111107',
      name_ur: 'درجہ ثامنہ (دورہِ حدیث)',
      name_en: 'Dora-e-Hadith (Final Year)',
      level_type: 'dars_nizami',
      capacity: 60
    }
  ];

  const { error: clsErr } = await supabase.from('classes').upsert(realClasses, { onConflict: 'id' });
  console.log("Classes Result:", clsErr ? clsErr.message : "✅ Success!");

  console.log("Testing anon insert into students...");
  const realStudents = [
    {
      id: '33333333-3333-3333-3333-333333330001',
      registration_id: 'REG-2026-0001',
      first_name: 'محمد زبیر بن عبداللہ',
      last_name: '',
      gender: 'male',
      current_class_id: '11111111-1111-1111-1111-111111111101',
      admission_date: '2026-01-10',
      status: 'active',
      father_name: 'عبداللہ خان قادری',
      father_phone: '0300-1234567',
      residential_address: 'لاہور، پاکستان'
    },
    {
      id: '33333333-3333-3333-3333-333333330111',
      registration_id: 'REG-2026-0111',
      first_name: 'عامر بن عبداللہ (درجہ اولیٰ)',
      last_name: '',
      gender: 'male',
      current_class_id: '11111111-1111-1111-1111-111111111105',
      admission_date: '2026-01-10',
      status: 'active',
      father_name: 'عبداللہ خان قادری',
      father_phone: '0300-1234567',
      residential_address: 'ملتان، پاکستان'
    },
    {
      id: '33333333-3333-3333-3333-333333330181',
      registration_id: 'REG-2026-0181',
      first_name: 'مولانا سعد بن طارق',
      last_name: '',
      gender: 'male',
      current_class_id: '11111111-1111-1111-1111-111111111107',
      admission_date: '2026-01-10',
      status: 'active',
      father_name: 'طارق عزیز عثمانی',
      father_phone: '0321-7654321',
      residential_address: 'کراچی، پاکستان'
    }
  ];
  const { error: stdErr } = await supabase.from('students').upsert(realStudents, { onConflict: 'id' });
  console.log("Students Result:", stdErr ? stdErr.message : "✅ Success!");

  console.log("Testing anon insert into subjects...");
  const realSubjects = [
    {
      id: '22222222-2222-2222-2222-222222220001',
      name_ur: 'نورانی قاعدہ (تختی 1 تا 10)',
      name_en: 'Noorani Qaida (1-10)',
      code: 'QAIDA-101',
      subject_type: 'compulsory',
      total_marks: 100,
      passing_marks: 40
    },
    {
      id: '22222222-2222-2222-2222-222222220111',
      name_ur: 'صرف میر و نحو میر',
      name_en: 'Sarf Meer & Nahw Meer',
      code: 'SARF-111',
      subject_type: 'compulsory',
      total_marks: 100,
      passing_marks: 40
    },
    {
      id: '22222222-2222-2222-2222-222222220181',
      name_ur: 'صحیح البخاری (جلد اول)',
      name_en: 'Sahih al-Bukhari (Vol 1)',
      code: 'HADITH-181',
      subject_type: 'compulsory',
      total_marks: 100,
      passing_marks: 40
    }
  ];
  const { error: subErr } = await supabase.from('subjects').upsert(realSubjects, { onConflict: 'id' });
  console.log("Subjects Result:", subErr ? subErr.message : "✅ Success!");

  console.log("Testing anon insert into exams...");
  const examId = '77777777-7777-7777-7777-777777777701';
  const { error: examErr } = await supabase.from('exams').upsert([{
    id: examId,
    title_ur: 'سالانہ امتحان 1447ھ',
    title_en: 'Annual Examination 2026',
    exam_type: 'annual',
    start_date: '2026-06-01',
    end_date: '2026-06-15',
    is_published: true
  }], { onConflict: 'id' });
  console.log("Exams Result:", examErr ? examErr.message : "✅ Success!");

  console.log("Testing anon insert into exam_results...");
  const realResults = [
    {
      exam_id: examId,
      student_id: '33333333-3333-3333-3333-333333330001',
      class_id: '11111111-1111-1111-1111-111111111101',
      subject_id: '22222222-2222-2222-2222-222222220001',
      total_marks: 100,
      obtained_marks: 95,
      grade: 'mumtaz',
      remarks: 'حسنِ قراءت اور مخارج کا بہترین التزام'
    },
    {
      exam_id: examId,
      student_id: '33333333-3333-3333-3333-333333330111',
      class_id: '11111111-1111-1111-1111-111111111105',
      subject_id: '22222222-2222-2222-2222-222222220111',
      total_marks: 100,
      obtained_marks: 92,
      grade: 'mumtaz',
      remarks: 'نحوی ترکیب میں بہترین مہارت'
    },
    {
      exam_id: examId,
      student_id: '33333333-3333-3333-3333-333333330181',
      class_id: '11111111-1111-1111-1111-111111111107',
      subject_id: '22222222-2222-2222-2222-222222220181',
      total_marks: 100,
      obtained_marks: 97,
      grade: 'mumtaz',
      remarks: 'احادیث کا شاندار استحضار'
    }
  ];
  const { error: resErr } = await supabase.from('exam_results').upsert(realResults, { onConflict: 'exam_id, student_id, subject_id' });
  console.log("Exam Results Result:", resErr ? resErr.message : "✅ Success!");
}

testAnonSeed();
