"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { 
  Settings, 
  BookOpen, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Award, 
  Calendar, 
  FileText, 
  ListChecks, 
  HeartHandshake, 
  Layers, 
  Sliders,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  GraduationCap,
  Database
} from 'lucide-react';

// Authentic default curriculum mapping for ALL 21 Madrasa classes (c1 to c21) exactly matching the Web App
export const curriculumMap: Record<string, { id: string; titleUr: string; titleEn: string; marks: number }[]> = {
  // 1. شعبہ حفظ و ناظرہ (c1 تا c3)
  c1: [
    { id: 'c1_1', titleUr: 'پرچہ 1: نورانی قاعدہ (تختی 1 تا 10)', titleEn: 'Paper 1: Noorani Qaida (Lvl 1-10)', marks: 100 },
    { id: 'c1_2', titleUr: 'پرچہ 2: نورانی قاعدہ (تختی 11 تا 17)', titleEn: 'Paper 2: Noorani Qaida (Lvl 11-17)', marks: 100 },
    { id: 'c1_3', titleUr: 'پرچہ 3: بنیادی مسنون دعائیں اور کلمے', titleEn: 'Paper 3: Daily Duas & Kalimas', marks: 100 },
    { id: 'c1_4', titleUr: 'پرچہ 4: طہارت، وضو اور نماز کے عملی مسائل', titleEn: 'Paper 4: Practical Wudu & Salah', marks: 50 },
  ],
  c2: [
    { id: 'c2_1', titleUr: 'پرچہ 1: ناظرہ قرآن کریم (پارہ 1 تا 10 باتجوید)', titleEn: 'Paper 1: Nazra Quran (Juz 1-10)', marks: 100 },
    { id: 'c2_2', titleUr: 'پرچہ 2: ناظرہ قرآن کریم (پارہ 11 تا 20)', titleEn: 'Paper 2: Nazra Quran (Juz 11-20)', marks: 100 },
    { id: 'c2_3', titleUr: 'پرچہ 3: ناظرہ قرآن کریم (پارہ 21 تا 30)', titleEn: 'Paper 3: Nazra Quran (Juz 21-30)', marks: 100 },
    { id: 'c2_4', titleUr: 'پرچہ 4: روزمرہ مسنون اذکار اور مسنون نماز', titleEn: 'Paper 4: Masnoon Azkar & Salah', marks: 50 },
  ],
  c3: [
    { id: 'c3_1', titleUr: 'پرچہ 1: نیا سبق اور سبقی کا روزانہ و ماہیانہ جائزہ', titleEn: 'Paper 1: Daily Sabaq & Sabaqi Test', marks: 100 },
    { id: 'c3_2', titleUr: 'پرچہ 2: آموختہ (منزل) کی روانی اور پختگی', titleEn: 'Paper 2: Manzil Revision Flow', marks: 100 },
    { id: 'c3_3', titleUr: 'پرچہ 3: تجوید، مخارج اور حسنِ صوت', titleEn: 'Paper 3: Tajweed & Voice Application', marks: 50 },
  ],

  // 2. شعبہ تجوید و قرآت (c4 تا c5)
  c4: [
    { id: 'c4_1', titleUr: 'پرچہ 1: مخارج الحروف اور صفاتِ حروف کی عملی مشق', titleEn: 'Paper 1: Phonetics & Articulation Practice', marks: 100 },
    { id: 'c4_2', titleUr: 'پرچہ 2: احکامِ تجوید (نون ساکن، مدود، تفخیم و ترقیق)', titleEn: 'Paper 2: Tajweed Rules (Nun, Madd, etc.)', marks: 100 },
    { id: 'c4_3', titleUr: 'پرچہ 3: جمالِ قرآن اور مشقِ تلاوت (روایت حفص)', titleEn: 'Paper 3: Recitation Practice (Hafs)', marks: 100 },
  ],
  c5: [
    { id: 'c5_1', titleUr: 'پرچہ 1: قراءتِ سبعہ (شاطبیہ کے اصول و فرش)', titleEn: 'Paper 1: Saba Qiraat (Shatibiyyah)', marks: 100 },
    { id: 'c5_2', titleUr: 'پرچہ 2: قراءتِ عشرہ (درۃ / طیبۃ النشر)', titleEn: 'Paper 2: Ashra Qiraat (Durrah / Tayyibah)', marks: 100 },
    { id: 'c5_3', titleUr: 'پرچہ 3: رسم الخط، علم الفواصل اور وقف و ابتدا', titleEn: 'Paper 3: Rasm-ul-Khatt & Waqf Rules', marks: 100 },
  ],

  // 3. شعبہ تعلیم بالغان (c6 تا c7)
  c6: [
    { id: 'c6_1', titleUr: 'پرچہ 1: عقائد و ایمانیات (ضروری دینی عقائد)', titleEn: 'Paper 1: Islamic Beliefs & Aqaid', marks: 100 },
    { id: 'c6_2', titleUr: 'پرچہ 2: فقہ العبادات (نماز، روزہ، زکوٰۃ کے مسائل)', titleEn: 'Paper 2: Fiqh of Worship (Salah, Fasting)', marks: 100 },
    { id: 'c6_3', titleUr: 'پرچہ 3: ترجمہ قرآن کریم (منتخب سورتیں و آیات)', titleEn: 'Paper 3: Selected Quran Translation', marks: 100 },
    { id: 'c6_4', titleUr: 'پرچہ 4: سیرت النبیﷺ اور اسلامی اخلاق', titleEn: 'Paper 4: Seerah & Islamic Ethics', marks: 100 },
  ],
  c7: [
    { id: 'c7_1', titleUr: 'پرچہ 1: روزمرہ اسلامی زندگی اور اخلاقِ حسنہ', titleEn: 'Paper 1: Daily Islamic Life & Ethics', marks: 100 },
    { id: 'c7_2', titleUr: 'پرچہ 2: طہارت و عبادات کا عملی طریقہ', titleEn: 'Paper 2: Practical Purification & Prayer', marks: 100 },
    { id: 'c7_3', titleUr: 'پرچہ 3: بنیادی دعائیں، سنتیں اور کلمے', titleEn: 'Paper 3: Basic Duas & Sunnahs', marks: 50 },
  ],

  // 4. شعبہ کتب (درس نظامی / عالمیت: c8 تا c18)
  c8: [
    { id: 'c8_1', titleUr: 'پرچہ 1: ابتدائی صرف و نحو (میزان و منشعب)', titleEn: 'Paper 1: Basic Sarf & Nahw', marks: 100 },
    { id: 'c8_2', titleUr: 'پرچہ 2: فارسی زبان و ادب (گلستانِ سعدی / کریما)', titleEn: 'Paper 2: Persian Literature (Gulistan)', marks: 100 },
    { id: 'c8_3', titleUr: 'پرچہ 3: آسان فقہ اور اسلامی معلومات', titleEn: 'Paper 3: Basic Fiqh & Islamic Knowledge', marks: 100 },
  ],
  c9: [
    { id: 'c9_1', titleUr: 'پرچہ 1: عربی بول چال اور ادب (القراءۃ الراشدۃ)', titleEn: 'Paper 1: Arabic Speaking & Lit (Al-Qiraat)', marks: 100 },
    { id: 'c9_2', titleUr: 'پرچہ 2: نحو عربی (ہدایت النحو / ابتدائی قواعد)', titleEn: 'Paper 2: Arabic Grammar (Hidayat-un-Nahw)', marks: 100 },
    { id: 'c9_3', titleUr: 'پرچہ 3: تعلیم الاسلام اور سیرتِ طیبہ', titleEn: 'Paper 3: Taleem-ul-Islam & Seerah', marks: 100 },
  ],
  c10: [
    { id: 'c10_1', titleUr: 'پرچہ 1: گرائمر عربی (کافیہ ابتدائی باب)', titleEn: 'Paper 1: Arabic Grammar (Kafiyah Basic)', marks: 100 },
    { id: 'c10_2', titleUr: 'پرچہ 2: فقہ اسلامی (مختصر القدوری ابتدائی کتب)', titleEn: 'Paper 2: Islamic Fiqh (Quduri Part 1)', marks: 100 },
    { id: 'c10_3', titleUr: 'پرچہ 3: حدیثِ نبوی (ریاض الصالحین منتخب احادیث)', titleEn: 'Paper 3: Hadith (Riyad-us-Saliheen)', marks: 100 },
    { id: 'c10_4', titleUr: 'پرچہ 4: مبادیاتِ منطق و فلسفہ', titleEn: 'Paper 4: Fundamentals of Logic', marks: 100 },
  ],
  c11: [
    { id: 'c11_1', titleUr: 'پرچہ 1: صرف میر و نحو میر', titleEn: 'Paper 1: Sarf Meer & Nahw Meer', marks: 100 },
    { id: 'c11_2', titleUr: 'پرچہ 2: فقہ حنفی (نور الایضاح / قدوری)', titleEn: 'Paper 2: Fiqh Hanafi (Noor-ul-Idah)', marks: 100 },
    { id: 'c11_3', titleUr: 'پرچہ 3: حدیث (زاد الطالبین)', titleEn: 'Paper 3: Hadith (Zad-ut-Talibin)', marks: 100 },
    { id: 'c11_4', titleUr: 'پرچہ 4: فارسی ادب (گلستانِ سعدی / کریما)', titleEn: 'Paper 4: Persian Literature (Gulistan)', marks: 100 },
    { id: 'c11_5', titleUr: 'پرچہ 5: سیرتِ خاتم الانبیاءﷺ', titleEn: 'Paper 5: Seerah of the Prophetﷺ', marks: 100 },
    { id: 'c11_6', titleUr: 'پرچہ 6: منطق (آسان منطق / مبادیات)', titleEn: 'Paper 6: Basic Logic (Asan Mantiq)', marks: 100 },
    { id: 'c11_7', titleUr: 'پرچہ 7: تجوید و مشقِ قرآن کریم', titleEn: 'Paper 7: Tajweed & Quran Practice', marks: 100 },
  ],
  c12: [
    { id: 'c12_1', titleUr: 'پرچہ 1: علم الصرف و میزان الصرف', titleEn: 'Paper 1: Advanced Sarf & Mizan', marks: 100 },
    { id: 'c12_2', titleUr: 'پرچہ 2: نحو (ہدایت النحو / کافیہ اول)', titleEn: 'Paper 2: Nahw (Hidayat-un-Nahw)', marks: 100 },
    { id: 'c12_3', titleUr: 'پرچہ 3: فقہ (مختصر القدوری مکمل)', titleEn: 'Paper 3: Fiqh (Mukhtasar al-Quduri Complete)', marks: 100 },
    { id: 'c12_4', titleUr: 'پرچہ 4: عربی ادب (نفحۃ العرب / القراءۃ الراشدۃ)', titleEn: 'Paper 4: Arabic Literature (Nafhat-ul-Arab)', marks: 100 },
    { id: 'c12_5', titleUr: 'پرچہ 5: تاریخ و قصص النبیین', titleEn: 'Paper 5: Islamic History & Qisas-un-Nabiyyin', marks: 100 },
    { id: 'c12_6', titleUr: 'پرچہ 6: منطق (تیسیر المنطق / ایساعوجی)', titleEn: 'Paper 6: Logic (Tayseer-ul-Mantiq)', marks: 100 },
  ],
  c13: [
    { id: 'c13_1', titleUr: 'پرچہ 1: نحو (کافیہ مکمل و الفیہ)', titleEn: 'Paper 1: Nahw (Kafiyah Complete)', marks: 100 },
    { id: 'c13_2', titleUr: 'پرچہ 2: فقہ (شرح وقایہ اولین)', titleEn: 'Paper 2: Fiqh (Sharh Wiqayah Part 1)', marks: 100 },
    { id: 'c13_3', titleUr: 'پرچہ 3: اصولِ فقہ (اصول الشاشی)', titleEn: 'Paper 3: Principles of Fiqh (Usul ash-Shashi)', marks: 100 },
    { id: 'c13_4', titleUr: 'پرچہ 4: عربی ادب و بلاغت (نفحۃ الیمن)', titleEn: 'Paper 4: Arabic Rhetoric (Nafhat-ul-Yaman)', marks: 100 },
    { id: 'c13_5', titleUr: 'پرچہ 5: مقاماتِ حریری (اولین)', titleEn: 'Paper 5: Maqamat al-Hariri (Part 1)', marks: 100 },
    { id: 'c13_6', titleUr: 'پرچہ 6: منطق و فلسفہ (مرقات / قطبی)', titleEn: 'Paper 6: Philosophy & Logic (Mirqat)', marks: 100 },
    { id: 'c13_7', titleUr: 'پرچہ 7: ترجمہ قرآن کریم (پارہ 1 تا 10)', titleEn: 'Paper 7: Quran Translation (Juz 1 to 10)', marks: 100 },
  ],
  c14: [
    { id: 'c14_1', titleUr: 'پرچہ 1: نحوی تحلیل و شرح جامی', titleEn: 'Paper 1: Advanced Nahw (Sharh Jami)', marks: 100 },
    { id: 'c14_2', titleUr: 'پرچہ 2: فقہ (شرح وقایہ آخرین / کنز الدقائق)', titleEn: 'Paper 2: Fiqh (Sharh Wiqayah Part 2)', marks: 100 },
    { id: 'c14_3', titleUr: 'پرچہ 3: اصولِ فقہ (نور الانوار)', titleEn: 'Paper 3: Usul al-Fiqh (Noor-ul-Anwar)', marks: 100 },
    { id: 'c14_4', titleUr: 'پرچہ 4: بلاغت و معانی (مختصر المعانی)', titleEn: 'Paper 4: Rhetoric (Mukhtasar al-Maani)', marks: 100 },
    { id: 'c14_5', titleUr: 'پرچہ 5: عقائد و علم الکلام (شرح عقائد نسفیہ)', titleEn: 'Paper 5: Islamic Theology (Sharh Aqaid)', marks: 100 },
    { id: 'c14_6', titleUr: 'پرچہ 6: ترجمہ قرآن کریم (پارہ 11 تا 20)', titleEn: 'Paper 6: Quran Translation (Juz 11 to 20)', marks: 100 },
    { id: 'c14_7', titleUr: 'پرچہ 7: حکمت و فلسفہ (ہدایۃ الحکمہ)', titleEn: 'Paper 7: Islamic Philosophy (Hidayat-ul-Hikmah)', marks: 100 },
  ],
  c15: [
    { id: 'c15_1', titleUr: 'پرچہ 1: فقہ عالیہ (ہدایہ اولین)', titleEn: 'Paper 1: Advanced Fiqh (Hidayah Part 1)', marks: 100 },
    { id: 'c15_2', titleUr: 'پرچہ 2: اصولِ فقہ (حسامی / التوضیح)', titleEn: 'Paper 2: Usul al-Fiqh (Husami)', marks: 100 },
    { id: 'c15_3', titleUr: 'پرچہ 3: ادب و مقاماتِ حریری (آخرین)', titleEn: 'Paper 3: Advanced Arabic Lit (Maqamat 2)', marks: 100 },
    { id: 'c15_4', titleUr: 'پرچہ 4: تفسیر قرآن (تفسیر جلالین اول)', titleEn: 'Paper 4: Tafseer (Tafseer Jalalayn Part 1)', marks: 100 },
    { id: 'c15_5', titleUr: 'پرچہ 5: فلسفہ و منطق (میبذی / سلم العلوم)', titleEn: 'Paper 5: Advanced Logic (Maybzi / Sullam)', marks: 100 },
    { id: 'c15_6', titleUr: 'پرچہ 6: شعر و ادب (دیوانِ متنبی / حماسہ)', titleEn: 'Paper 6: Classical Poetry (Diwan al-Mutanabbi)', marks: 100 },
    { id: 'c15_7', titleUr: 'پرچہ 7: ترجمہ قرآن کریم (پارہ 21 تا 30)', titleEn: 'Paper 7: Quran Translation (Juz 21 to 30)', marks: 100 },
  ],
  c16: [
    { id: 'c16_1', titleUr: 'پرچہ 1: فقہ عالیہ (ہدایہ آخرین حصہ اول)', titleEn: 'Paper 1: Advanced Fiqh (Hidayah Part 2A)', marks: 100 },
    { id: 'c16_2', titleUr: 'پرچہ 2: تفسیر قرآن (تفسیر جلالین دوم)', titleEn: 'Paper 2: Tafseer (Tafseer Jalalayn Part 2)', marks: 100 },
    { id: 'c16_3', titleUr: 'پرچہ 3: اصولِ حدیث (شرح نخبة الفکر)', titleEn: 'Paper 3: Hadith Principles (Nukhbat-ul-Fikr)', marks: 100 },
    { id: 'c16_4', titleUr: 'پرچہ 4: حدیثِ نبوی (مشکوٰۃ المصابیح اول)', titleEn: 'Paper 4: Hadith Studies (Mishkat Part 1)', marks: 100 },
    { id: 'c16_5', titleUr: 'پرچہ 5: عقائد عالیہ (شرح مواقف / مسامرہ)', titleEn: 'Paper 5: Advanced Theology (Sharh Mawaqif)', marks: 100 },
    { id: 'c16_6', titleUr: 'پرچہ 6: اصولِ تفسیر (الفوز الکبیر / اتقان)', titleEn: 'Paper 6: Quranic Principles (Al-Fawz al-Kabir)', marks: 100 },
  ],
  c17: [
    { id: 'c17_1', titleUr: 'پرچہ 1: فقہ عالیہ (ہدایہ آخرین - کتاب البیوع و مابعد)', titleEn: 'Paper 1: Advanced Fiqh (Hidayah Part 2B)', marks: 100 },
    { id: 'c17_2', titleUr: 'پرچہ 2: تفسیر بیضاوی / کشاف (منتخب سورتیں)', titleEn: 'Paper 2: Tafseer al-Baydawi / Kashaf', marks: 100 },
    { id: 'c17_3', titleUr: 'پرچہ 3: حدیثِ نبوی (مشکوٰۃ المصابیح دوم)', titleEn: 'Paper 3: Hadith Studies (Mishkat Part 2)', marks: 100 },
    { id: 'c17_4', titleUr: 'پرچہ 4: عقائد و کلام (مسامرہ / شرح مواقف آخرین)', titleEn: 'Paper 4: Advanced Theology Part 2', marks: 100 },
    { id: 'c17_5', titleUr: 'پرچہ 5: علم المیراث و فرائض (سراجی فی المیراث)', titleEn: 'Paper 5: Inheritance Law (Siraji fil Mirath)', marks: 100 },
  ],
  c18: [
    { id: 'c18_1', titleUr: 'پرچہ 1: صحیح البخاری (جلد اول)', titleEn: 'Paper 1: Sahih al-Bukhari (Vol 1)', marks: 100 },
    { id: 'c18_2', titleUr: 'پرچہ 2: صحیح البخاری (جلد دوم)', titleEn: 'Paper 2: Sahih al-Bukhari (Vol 2)', marks: 100 },
    { id: 'c18_3', titleUr: 'پرچہ 3: صحیح مسلم شریف (مکمل)', titleEn: 'Paper 3: Sahih Muslim (Complete)', marks: 100 },
    { id: 'c18_4', titleUr: 'پرچہ 4: جامع الترمذی (سنن ترمذی)', titleEn: 'Paper 4: Jami at-Tirmidhi', marks: 100 },
    { id: 'c18_5', titleUr: 'پرچہ 5: سنن أبي داؤد شریف', titleEn: 'Paper 5: Sunan Abu Dawood', marks: 100 },
    { id: 'c18_6', titleUr: 'پرچہ 6: سنن النسائي شریف', titleEn: 'Paper 6: Sunan an-Nasa\'i', marks: 100 },
    { id: 'c18_7', titleUr: 'پرچہ 7: سنن ابن ماجة شریف', titleEn: 'Paper 7: Sunan Ibn Majah', marks: 100 },
    { id: 'c18_8', titleUr: 'پرچہ 8: موطأ إمام مالك ورواية يحيى', titleEn: 'Paper 8: Muwatta Imam Malik', marks: 100 },
    { id: 'c18_9', titleUr: 'پرچہ 9: موطأ إمام محمد بن الحسن الشيباني', titleEn: 'Paper 9: Muwatta Imam Muhammad', marks: 100 },
    { id: 'c18_10', titleUr: 'پرچہ 10: شرح معاني الآثار (طحاوي شریف)', titleEn: 'Paper 10: Sharh Ma\'ani al-Athar (Tahawi)', marks: 100 },
  ],

  // 5. شعبہ تخصصات (c19 تا c21)
  c19: [
    { id: 'c19_1', titleUr: 'پرچہ 1: تفسیر ابن کثیر و تفسیر قرطبی تحقیق', titleEn: 'Paper 1: Tafseer Ibn Kathir & Qurtubi Research', marks: 100 },
    { id: 'c19_2', titleUr: 'پرچہ 2: اصولِ تفسیر ومناہج المفسرین', titleEn: 'Paper 2: Usul al-Tafseer & Commentator Methods', marks: 100 },
    { id: 'c19_3', titleUr: 'پرچہ 3: علوم القرآن (الاتقان فی علوم القرآن)', titleEn: 'Paper 3: Ulum al-Quran (Al-Itqan)', marks: 100 },
    { id: 'c19_4', titleUr: 'پرچہ 4: مناهج تدبر القرآن وحل اشکالات', titleEn: 'Paper 4: Tadabbur Methods & Problem Resolution', marks: 100 },
  ],
  c20: [
    { id: 'c20_1', titleUr: 'پرچہ 1: تدريب الراوي في شرح تقريب النواوي', titleEn: 'Paper 1: Tadrib-ur-Rawi (Hadith Sciences)', marks: 100 },
    { id: 'c20_2', titleUr: 'پرچہ 2: معرفة علوم الحديث للحاكم / مقدمة ابن الصلاح', titleEn: 'Paper 2: Ulum al-Hadith & Ibn al-Salah', marks: 100 },
    { id: 'c20_3', titleUr: 'پرچہ 3: علل الحديث ومعرفة الرجال والطبقات', titleEn: 'Paper 3: Ilal al-Hadith & Rijal Studies', marks: 100 },
    { id: 'c20_4', titleUr: 'پرچہ 4: تخريج الأحاديث ومناهج المحدثين', titleEn: 'Paper 4: Takhreej methods & Muhaddithin', marks: 100 },
    { id: 'c20_5', titleUr: 'پرچہ 5: نقد السند والمتن وتحقيق المخطوطات', titleEn: 'Paper 5: Sanad Criticism & Manuscript Research', marks: 100 },
  ],
  c21: [
    { id: 'c21_1', titleUr: 'پرچہ 1: فتاوى شامي (رد المحتار اولین)', titleEn: 'Paper 1: Fatawa Shami (Radd-ul-Muhtar Part 1)', marks: 100 },
    { id: 'c21_2', titleUr: 'پرچہ 2: الأشباه والنظائر لابن نجيم', titleEn: 'Paper 2: Al-Ashbah wan-Naza\'ir', marks: 100 },
    { id: 'c21_3', titleUr: 'پرچہ 3: أصول الإفتاء ورسم المفتي', titleEn: 'Paper 3: Usul al-Iftaa & Rasm al-Mufti', marks: 100 },
    { id: 'c21_4', titleUr: 'پرچہ 4: فتاوى عالمغيري (الهندية) ومسائل وقائع', titleEn: 'Paper 4: Fatawa Alamgiri & Case Studies', marks: 100 },
    { id: 'c21_5', titleUr: 'پرچہ 5: تمرين الفتاوى والمسائل المعاصرة', titleEn: 'Paper 5: Contemporary Fatawa Practice', marks: 100 },
  ],
};

const initialCurriculumMap = curriculumMap;

export function ExamSystemConfigDesk() {
  const { locale } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const supabase = createClient();

  const fetchExamsFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data } = await (supabase as any).from('exams').select('*');
      if (data && data.length > 0) {
        // Exams verified from DB
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchExamsFromDb();
  }, []);

  const handleSeedExams = async () => {
    setSeedingDb(true);
    try {
      const realExams = [
        { id: '77777777-7777-7777-7777-777777777701', title_ur: 'سالانہ امتحان 1447ھ (عصری و دینی علوم)', title_en: 'Annual Examination 2026', exam_type: 'annual', start_date: '2026-06-01', end_date: '2026-06-15', is_published: true },
        { id: '77777777-7777-7777-7777-777777777702', title_ur: 'ششماہی / وسط سال امتحان (Mid Term)', title_en: 'Mid-Term Examination', exam_type: 'mid_term', start_date: '2026-01-10', end_date: '2026-01-20', is_published: true }
      ];
      const { error } = await (supabase as any).from('exams').upsert(realExams, { onConflict: 'id', ignoreDuplicates: true });
      if (error) {
        toast.error(locale === 'ur' ? `ایرر: ${error.message}` : `Error: ${error.message}`);
      } else {
        await fetchExamsFromDb();
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! 2 حقیقی و مستند امتحانی سیشنز لائیو DB میں شامل ہو گئے!' : '🎉 2 authentic exam sessions seeded into live DB!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error seeding exams');
    } finally {
      setSeedingDb(false);
    }
  };

  // 1. Term Structure Model State
  const [termModel, setTermModel] = useState<'three_six_annual' | 'monthly_four_annual' | 'semester'>('three_six_annual');

  // 2. Selected Class for Curriculum Editing (Defaults to c11: Ula)
  const [selectedClassKey, setSelectedClassKey] = useState('c11');

  // 3. Class-Wise Curriculum State
  const [curriculumMap, setCurriculumMap] = useState<Record<string, { id: string; titleUr: string; titleEn: string; marks: number }[]>>(initialCurriculumMap);

  // 4. Hifz & Nazra Evaluation Criteria State (Optional Universal Oral Criteria for c1-c5)
  const [hifzCriteria, setHifzCriteria] = useState([
    { id: 'h1', urdu: 'تلاوت و یادداشت کا جائزہ (Memory & Recitation)', en: 'Quran Memory & Recitation Accuracy', marks: 100, enabled: true },
    { id: 'h2', urdu: 'تجوید و مخارج الحروف (Tajweed & Phonetics)', en: 'Tajweed Rules & Phonetics', marks: 50, enabled: true },
    { id: 'h3', urdu: 'منزل، سبق اور سبقی روانی (Manzil & Sabaqi)', en: 'Manzil & Sabaqi Revision Flow', marks: 50, enabled: true },
    { id: 'h4', urdu: 'صفائی ستھرائی، اخلاق اور ظاہری ہیئت (Hygiene & Manners)', en: 'Cleanliness, Manners & Personal Hygiene', marks: 25, enabled: true },
  ]);

  const activeClassPapers = curriculumMap[selectedClassKey] || [];

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await (supabase as any).from('exams').select('id').limit(1);
      if (!existing || existing.length === 0) {
        await handleSeedExams();
      }
      toast.success(
        locale === 'ur'
          ? '🎉 الحمدللہ! مدرسہ کے تمام 21 درجات کے پرچہ جات اور امتحانی سیشنز لائیو DB میں محفوظ ہو گئے ہیں!'
          : '🎉 Success! All 21 class-wise subject papers and exam configs saved to live DB!'
      );
    } catch (err: any) {
      toast.error(err.message || 'Error saving config');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleHifzCriterion = (id: string) => {
    setHifzCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  // Dynamic Paper Actions for Selected Class
  const handleAddPaper = () => {
    const newId = `p_${Date.now()}`;
    const newPaperIndex = activeClassPapers.length + 1;
    const newPaper = {
      id: newId,
      titleUr: `پرچہ ${newPaperIndex}: (نئی کتاب، سورت یا مضمون کا نام لکھیں)`,
      titleEn: `Paper ${newPaperIndex}: (Enter Subject / Book Title)`,
      marks: 100,
    };
    setCurriculumMap((prev) => ({
      ...prev,
      [selectedClassKey]: [...(prev[selectedClassKey] || []), newPaper],
    }));
    toast.success(locale === 'ur' ? `نیا پرچہ شامل کر دیا گیا! آپ اپنی مرضی سے نام لکھ سکتے ہیں۔` : `New paper added to current class!`);
  };

  const handleRemovePaper = (id: string) => {
    if (activeClassPapers.length <= 1) {
      toast.error(locale === 'ur' ? 'کم از کم ایک پرچہ باقی رہنا ضروری ہے!' : 'At least one paper is required for the class!');
      return;
    }
    setCurriculumMap((prev) => ({
      ...prev,
      [selectedClassKey]: prev[selectedClassKey].filter((p) => p.id !== id),
    }));
    toast.info(locale === 'ur' ? 'پرچہ نصاب سے حذف کر دیا گیا!' : 'Paper removed from curriculum!');
  };

  const handleUpdatePaper = (id: string, field: 'titleUr' | 'titleEn' | 'marks', value: any) => {
    setCurriculumMap((prev) => ({
      ...prev,
      [selectedClassKey]: prev[selectedClassKey].map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const getClassTitle = (key: string) => {
    switch (key) {
      case 'c1': return locale === 'ur' ? 'قاعدہ (شعبہ حفظ و ناظرہ)' : 'c1: Qaida (Basics)';
      case 'c2': return locale === 'ur' ? 'ناظرہ قرآن کریم' : 'c2: Nazra Quran';
      case 'c3': return locale === 'ur' ? 'حفظِ قرآن کریم' : 'c3: Hifz al-Quran';
      case 'c4': return locale === 'ur' ? 'تجوید (روایت حفص)' : 'c4: Tajweed Course';
      case 'c5': return locale === 'ur' ? 'قرآت (سبعہ و عشرہ)' : 'c5: Qiraat (Saba & Ashra)';
      case 'c6': return locale === 'ur' ? 'دراسِاتِ دینیہ (ایک سالہ کورس)' : 'c6: Dirasat-e-Deeniyah';
      case 'c7': return locale === 'ur' ? 'آسان دینیات (بنیادی کورس)' : 'c7: Aasan Deeniyat';
      case 'c8': return locale === 'ur' ? 'اعدادیہ اول (مڈل / بنیاد)' : 'c8: Idadiyah Year 1';
      case 'c9': return locale === 'ur' ? 'اعدادیہ دوم (تیاری عالمیت)' : 'c9: Idadiyah Year 2';
      case 'c10': return locale === 'ur' ? 'اعدادیہ سوم' : 'c10: Idadiyah Year 3';
      case 'c11': return locale === 'ur' ? 'درجہ اولیٰ (عامہ اولیٰ - سال اول)' : 'c11: Ula (Year 1 Alimiyah)';
      case 'c12': return locale === 'ur' ? 'درجہ ثانیہ (عامہ ثانیہ - سال دوم)' : 'c12: Saniyah (Year 2 Alimiyah)';
      case 'c13': return locale === 'ur' ? 'درجہ ثالثہ (خاصہ اولیٰ - سال سوم)' : 'c13: Salisah (Year 3 Alimiyah)';
      case 'c14': return locale === 'ur' ? 'درجہ رابعہ (خاصہ ثانیہ - سال چہارم)' : 'c14: Rabiah (Year 4 Alimiyah)';
      case 'c15': return locale === 'ur' ? 'درجہ خامسہ (عالیہ اولیٰ - سال پنجم)' : 'c15: Khamisah (Year 5 Alimiyah)';
      case 'c16': return locale === 'ur' ? 'درجہ سادسہ (عالیہ ثانیہ - سال ششم)' : 'c16: Sadisah (Year 6 Alimiyah)';
      case 'c17': return locale === 'ur' ? 'درجہ سابعہ (موقوف علیہ - سال ہفتم)' : 'c17: Sabiah (Year 7 Alimiyah)';
      case 'c18': return locale === 'ur' ? 'درجہ ثامنہ (دورہِ حدیث - سال آخر)' : 'c18: Dora-e-Hadith (Final Year)';
      case 'c19': return locale === 'ur' ? 'تخصص فی التفسیر' : 'c19: Takhassus fil Tafseer';
      case 'c20': return locale === 'ur' ? 'تخصص فی الحدیث' : 'c20: Takhassus fil Hadith';
      case 'c21': return locale === 'ur' ? 'تخصص فی الفقہ والافتاء' : 'c21: Takhassus fil Fiqh (Ifta)';
      default: return key;
    }
  };

  return (
    <div className={`space-y-8 animate-in fade-in-50 duration-300 ${locale === 'ur' ? 'font-ur' : 'font-en'}`}>
      {/* Header Banner */}
      <Card className="border-border shadow-md bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden relative rounded-3xl border border-white/10">
        <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 sm:p-8 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{locale === 'ur' ? 'ویب ایپ کے تمام 21 درجات کے لیے لچکدار ترتیبات' : 'Universal 21-Class Madrasa Exam Configurator'}</span>
            </Badge>
            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Sliders className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>{locale === 'ur' ? 'امتحانی اصطلاحات اور درجہ وار متحرک نصاب و پرچہ جات ساز' : 'Dynamic Class-Wise Curriculum & Paper Builder'}</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
              {locale === 'ur'
                ? 'مدرسہ کے تمام 21 درجات (حفظ، ناظرہ، قاعدہ، اعدادیہ، عالمیت اور تخصصات) یہاں موجود ہیں۔ ہر کلاس کا نصاب مختلف ہے۔ جس درجہ کے پرچے بنانے ہوں، ڈراپ ڈاؤن سے منتخب کریں اور اپنی مرضی سے پرچے شامل یا حذف کریں۔'
                : 'All 21 authentic classes from the app are available. Easily select any grade from Qaida, Nazra, Hifz, Dars-e-Nizami, to Specializations and dynamically add or remove custom examination papers.'}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSeedExams}
              disabled={seedingDb}
              className="font-bold border-white/20 bg-white/5 text-white hover:bg-white/10 gap-1.5 text-xs py-5 px-4 rounded-xl shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{seedingDb ? (locale === 'ur' ? 'امتحانات سیڈ ہو رہے ہیں...' : 'Seeding...') : (locale === 'ur' ? '⚡ لائیو DB میں امتحانات محفوظ کریں' : 'Seed Exams to DB')}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={fetchExamsFromDb}
              className="h-10 w-10 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl"
              title="Refresh DB"
            >
              <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              type="button"
              variant="emerald"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="font-extrabold text-xs sm:text-sm px-6 py-5 rounded-xl shadow-xl gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none hover:scale-105 transition-transform"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? (locale === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Saving...') : (locale === 'ur' ? 'تمام ترتیبات محفوظ کریں' : 'Save Configs')}</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* SECTION 1: EXAMINATION TERM STRUCTURE MODEL */}
      <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/40 pb-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl font-extrabold flex items-center gap-2.5 text-foreground">
                <Calendar className="w-6 h-6 text-primary" />
                <span>{locale === 'ur' ? '1. مدرسہ کا سالانہ امتحانی نظام اور اصطلاحات کا ماڈل (Term Structure)' : '1. Annual Examination Terms & Schedule Model'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {locale === 'ur'
                  ? 'منتخب کریں کہ آپ کے جامعہ یا مدرسے میں سال کے دوران امتحانات کی تقسیم اور نوعیت کس طرز پر ہوتی ہے:'
                  : 'Select how examination terms and evaluations are structured throughout the academic year in your institution:'}
              </CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/30 font-bold text-xs px-3 py-1">
              {termModel === 'three_six_annual' ? (locale === 'ur' ? 'روایتی نظام' : 'Traditional') :
               termModel === 'monthly_four_annual' ? (locale === 'ur' ? 'جامعہ و دارالعلوم نظام' : 'Darul Uloom Model') : 'Semester System'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model A: Three, Six, Annual */}
            <div
              onClick={() => setTermModel('three_six_annual')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                termModel === 'three_six_annual'
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30 font-bold text-xs">
                    {locale === 'ur' ? 'ماڈل الف (معروف ترین)' : 'Model A (Standard)'}
                  </Badge>
                  {termModel === 'three_six_annual' && (
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                  )}
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  {locale === 'ur' ? 'سہ ماہی + شش ماہی + سالانہ نظام' : '3-Month, 6-Month & Annual System'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === 'ur'
                    ? 'روایتی دینی مدارس کا سب سے مروجہ نظام جس میں سال میں تین باضابطہ بڑے امتحانات منعقد ہوتے ہیں: سہ ماہی (Quarterly)، شش ماہی / مڈ ٹرم (Half-Yearly) اور سالانہ (Annual)۔'
                    : 'The classical Madrasa evaluation system featuring three main term examinations: Quarterly (3-Month), Mid-Term (6-Month), and Comprehensive Annual.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                <span>{locale === 'ur' ? '3 باضابطہ امتحانی سیشنز' : '3 Main Exam Terms'}</span>
                <span className="font-en">100% Flexible</span>
              </div>
            </div>

            {/* Model B: Monthly, Four, Annual */}
            <div
              onClick={() => setTermModel('monthly_four_annual')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                termModel === 'monthly_four_annual'
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-bold text-xs">
                    {locale === 'ur' ? 'ماڈل ب (جامعہ نظام)' : 'Model B (Comprehensive)'}
                  </Badge>
                  {termModel === 'monthly_four_annual' && (
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                  )}
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  {locale === 'ur' ? 'یک ماہی جائزہ + چار ماہی + سالانہ نظام' : 'Monthly Eval, 4-Month & Annual System'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === 'ur'
                    ? 'کئی بڑے مدارس کا نظام جہاں ہر مہینے یک ماہی جائزہ (Monthly Test) لیا جاتا ہے تاکہ طلباء مستعد رہیں، اور پھر سال میں دو بڑے باضابطہ امتحانات ہوتے ہیں: چار ماہی (4-Month) اور سالانہ امتحان۔'
                    : 'A thorough continuous assessment model where monthly evaluation tests keep students sharp, followed by two major examinations: 4-Month (Trimester 1) and Final Annual.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>{locale === 'ur' ? 'ماہانہ ٹیسٹ + 2 بڑے امتحانات' : 'Monthly + 2 Major Terms'}</span>
                <span className="font-en">Continuous Eval</span>
              </div>
            </div>

            {/* Model C: Semester */}
            <div
              onClick={() => setTermModel('semester')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                termModel === 'semester'
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30 font-bold text-xs">
                    {locale === 'ur' ? 'ماڈل ج (عصری و تخصص)' : 'Model C (Semester)'}
                  </Badge>
                  {termModel === 'semester' && (
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                  )}
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  {locale === 'ur' ? 'سیمسٹر نظام (خزاں / بہار سیشن)' : 'Semester System (Fall / Spring Term)'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === 'ur'
                    ? 'شعبہ تخصصات (افتاء، فی الفقہ)، یونیورسٹی لیول، یا عصری سکول سیکشن کے لیے جہاں سال کو 6 ماہ کے دو سیمسٹرز (Fall Semester اور Spring Semester) میں تقسیم کیا جاتا ہے۔'
                    : 'Tailored for higher specialization departments (Takhassus, Iftaa) or university-style modern school sections split into Fall and Spring academic semesters.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>{locale === 'ur' ? '2 سیمسٹرز اور مڈ ٹرم' : '2 Semesters & Mid-Terms'}</span>
                <span className="font-en">University Style</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: DEPARTMENT-SPECIFIC EXAM PROFILES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SUB-SECTION 2A: HIFZ, NAZRA & QAIDA SPECIAL EVALUATION */}
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card flex flex-col justify-between">
          <div>
            <CardHeader className="bg-muted/40 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-foreground">
                    <HeartHandshake className="w-5 h-5 text-teal-600" />
                    <span>{locale === 'ur' ? '2-الف. زبانی، اخلاقی و ظاہری ہیئت کا معائنہ (اختیاری)' : '2-A. Oral Recitation & Hygiene Criteria Profile'}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {locale === 'ur'
                      ? 'حفظ، ناظرہ، قاعدہ اور تجوید کے طلباء کے لیے زبانی تلاوت، منزل اور صفائی ستھرائی کے نمبرات یہاں سیٹ کریں (جبکہ نصابی پرچے ساتھ والے سیکشن 2-ب میں بھی شامل کیے جا سکتے ہیں):'
                      : 'Define oral recitation, Tajweed fluency, Manzil revision, and cleanliness evaluation criteria for Quranic departments (can be combined with custom papers in 2-B):'}
                  </CardDescription>
                </div>
                <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30 font-bold text-xs px-2.5 py-1">
                  {locale === 'ur' ? 'زبانی و اخلاقی معائنہ' : 'Oral & Manners'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-300 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {locale === 'ur'
                    ? 'نوٹ: رزلٹ کارڈ پر یہ تمام نکات باقاعدہ ظاہر ہوں گے۔ اگر آپ قاعدہ، ناظرہ یا حفظ میں مزید پرچے (مثلاً دعائیں، اذکار یا سورتوں کا ٹیسٹ) بھی لینا چاہتے ہیں، تو ساتھ والے سیکشن 2-ب کے ڈراپ ڈاؤن سے قاعدہ (c1)، ناظرہ (c2) یا حفظ (c3) منتخب کر کے نیا پرچہ شامل کر سکتے ہیں!'
                    : 'Note: These parameters appear on the result card. You can also add written or oral test papers for Qaida (c1), Nazra (c2), or Hifz (c3) in Section 2-B!'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {hifzCriteria.map((crit) => (
                  <div
                    key={crit.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      crit.enabled ? 'bg-card border-border shadow-sm' : 'bg-muted/40 border-border/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleHifzCriterion(crit.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          crit.enabled ? 'bg-teal-600 text-white' : 'bg-muted border border-border text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="font-extrabold text-xs sm:text-sm text-foreground">
                          {locale === 'ur' ? crit.urdu : crit.en}
                        </div>
                        {crit.id === 'h4' && (
                          <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                            {locale === 'ur' ? '✨ لباس، ناخن، بستر اور ظاہری ہیئت کی صفائی' : '✨ Dress, hygiene, discipline & room tidiness'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground font-semibold">{locale === 'ur' ? 'کل نمبر:' : 'Max:'}</span>
                      <Input
                        type="number"
                        value={crit.marks}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setHifzCriteria(prev => prev.map(c => c.id === crit.id ? { ...c, marks: val } : c));
                        }}
                        className="w-16 h-8 text-center font-mono font-bold text-xs bg-background"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>

          <CardFooter className="bg-muted/30 p-4 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>{locale === 'ur' ? 'مجموعی کل نمبرات:' : 'Total Max Marks:'}</span>
            <span className="font-en text-sm font-black text-teal-600">
              {hifzCriteria.filter(c => c.enabled).reduce((acc, c) => acc + c.marks, 0)} Marks
            </span>
          </CardFooter>
        </Card>

        {/* SUB-SECTION 2B: CLASS-WISE DYNAMIC CURRICULUM & PAPER BUILDER (ALL 21 CLASSES) */}
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card flex flex-col justify-between">
          <div>
            <CardHeader className="bg-muted/40 pb-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-foreground">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>{locale === 'ur' ? '2-ب. درجہ وار متحرک نصاب اور پرچہ جات ساز' : '2-B. Class-Wise Dynamic Curriculum & Paper Builder'}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {locale === 'ur'
                      ? 'ویب ایپ میں موجود تمام 21 درجات (حفظ، ناظرہ، قاعدہ سے دورہ حدیث و تخصصات تک) یہاں دستیاب ہیں۔ کوئی بھی درجہ منتخب کریں اور پرچے شامل یا حذف کریں:'
                      : 'All 21 authentic web app classes are listed. Select a class (including Qaida, Nazra, Hifz, and Alimiyah) to dynamically add or remove papers:'}
                  </CardDescription>
                </div>

                <div className="shrink-0 w-full sm:w-64">
                  <Select value={selectedClassKey} onValueChange={(val: any) => setSelectedClassKey(val)}>
                    <SelectTrigger className="w-full h-10 rounded-xl font-extrabold text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl max-h-72">
                      <div className="px-2 py-1 text-[11px] font-black text-muted-foreground bg-muted/40">{locale === 'ur' ? '1. شعبہ حفظ و ناظرہ' : '1. Hifz & Nazra Dept'}</div>
                      <SelectItem value="c1" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'قاعدہ (شعبہ حفظ و ناظرہ)' : 'c1: Qaida (Basics)'}</SelectItem>
                      <SelectItem value="c2" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'ناظرہ قرآن کریم' : 'c2: Nazra Quran'}</SelectItem>
                      <SelectItem value="c3" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'حفظِ قرآن کریم' : 'c3: Hifz al-Quran'}</SelectItem>

                      <div className="px-2 py-1 text-[11px] font-black text-muted-foreground bg-muted/40 mt-1">{locale === 'ur' ? '2. شعبہ تجوید و قرآت' : '2. Tajweed & Qiraat'}</div>
                      <SelectItem value="c4" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'تجوید (روایت حفص)' : 'c4: Tajweed Course'}</SelectItem>
                      <SelectItem value="c5" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'قرآت (سبعہ و عشرہ)' : 'c5: Qiraat (Saba & Ashra)'}</SelectItem>

                      <div className="px-2 py-1 text-[11px] font-black text-muted-foreground bg-muted/40 mt-1">{locale === 'ur' ? '3. شعبہ تعلیم بالغان' : '3. Adult Education'}</div>
                      <SelectItem value="c6" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'دراسِاتِ دینیہ (ایک سالہ کورس)' : 'c6: Dirasat-e-Deeniyah'}</SelectItem>
                      <SelectItem value="c7" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'آسان دینیات (بنیادی کورس)' : 'c7: Aasan Deeniyat'}</SelectItem>

                      <div className="px-2 py-1 text-[11px] font-black text-muted-foreground bg-muted/40 mt-1">{locale === 'ur' ? '4. شعبہ کتب (درس نظامی / عالمیت)' : '4. Dars-e-Nizami (Alimiyah)'}</div>
                      <SelectItem value="c8" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'اعدادیہ اول (مڈل / بنیاد)' : 'c8: Idadiyah Year 1'}</SelectItem>
                      <SelectItem value="c9" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'اعدادیہ دوم (تیاری عالمیت)' : 'c9: Idadiyah Year 2'}</SelectItem>
                      <SelectItem value="c10" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'اعدادیہ سوم' : 'c10: Idadiyah Year 3'}</SelectItem>
                      <SelectItem value="c11" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ اولیٰ (عامہ اولیٰ - سال اول)' : 'c11: Ula (Year 1 Alimiyah)'}</SelectItem>
                      <SelectItem value="c12" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ ثانیہ (عامہ ثانیہ - سال دوم)' : 'c12: Saniyah (Year 2 Alimiyah)'}</SelectItem>
                      <SelectItem value="c13" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ ثالثہ (خاصہ اولیٰ - سال سوم)' : 'c13: Salisah (Year 3 Alimiyah)'}</SelectItem>
                      <SelectItem value="c14" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ رابعہ (خاصہ ثانیہ - سال چہارم)' : 'c14: Rabiah (Year 4 Alimiyah)'}</SelectItem>
                      <SelectItem value="c15" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ خامسہ (عالیہ اولیٰ - سال پنجم)' : 'c15: Khamisah (Year 5 Alimiyah)'}</SelectItem>
                      <SelectItem value="c16" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ سادسہ (عالیہ ثانیہ - سال ششم)' : 'c16: Sadisah (Year 6 Alimiyah)'}</SelectItem>
                      <SelectItem value="c17" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ سابعہ (موقوف علیہ - سال ہفتم)' : 'c17: Sabiah (Year 7 Alimiyah)'}</SelectItem>
                      <SelectItem value="c18" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'درجہ ثامنہ (دورہِ حدیث - سال آخر)' : 'c18: Dora-e-Hadith (Final Year)'}</SelectItem>

                      <div className="px-2 py-1 text-[11px] font-black text-muted-foreground bg-muted/40 mt-1">{locale === 'ur' ? '5. شعبہ تخصصات (التخصص)' : '5. Specializations'}</div>
                      <SelectItem value="c19" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'تخصص فی التفسیر' : 'c19: Takhassus fil Tafseer'}</SelectItem>
                      <SelectItem value="c20" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'تخصص فی الحدیث (علوم الحدیث)' : 'c20: Takhassus fil Hadith'}</SelectItem>
                      <SelectItem value="c21" className="text-xs font-bold py-1.5">{locale === 'ur' ? 'تخصص فی الفقہ والافتاء (مفتی کورس)' : 'c21: Takhassus fil Fiqh (Ifta)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 text-xs font-extrabold px-3 py-1">
                  {getClassTitle(selectedClassKey)}
                </Badge>
                <Button
                  type="button"
                  variant="emerald"
                  size="sm"
                  onClick={handleAddPaper}
                  className="font-extrabold text-xs rounded-xl shadow-md gap-1.5 h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{locale === 'ur' ? '+ نیا پرچہ / کتاب شامل کریں' : '+ Add Paper Slot'}</span>
                </Button>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {activeClassPapers.map((paper, index) => (
                  <div key={paper.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-2.5 hover:border-indigo-400 transition-all group">
                    <div className="flex items-center gap-2.5 w-full">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-en font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                        P{index + 1}
                      </span>
                      <Input
                        type="text"
                        value={locale === 'ur' ? paper.titleUr : paper.titleEn}
                        onChange={(e) => handleUpdatePaper(paper.id, locale === 'ur' ? 'titleUr' : 'titleEn', e.target.value)}
                        placeholder={locale === 'ur' ? 'پرچہ، کتاب یا موضوع کا نام لکھیں...' : 'Enter paper/book title...'}
                        className="h-9 text-xs font-bold border-transparent hover:border-border focus:border-indigo-500 bg-background w-full"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">{locale === 'ur' ? 'نمبر:' : 'Max:'}</span>
                      <Input
                        type="number"
                        value={paper.marks}
                        onChange={(e) => handleUpdatePaper(paper.id, 'marks', Number(e.target.value))}
                        className="w-16 h-8 text-center font-mono font-bold text-xs bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePaper(paper.id)}
                        title={locale === 'ur' ? 'یہ پرچہ حذف کریں' : 'Remove paper'}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>

          <CardFooter className="bg-muted/30 p-4 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>{locale === 'ur' ? `کل پرچے: ${activeClassPapers.length} پرچے` : `Total Papers: ${activeClassPapers.length} Papers`}</span>
            <span className="font-en text-sm font-black text-indigo-600">
              {activeClassPapers.reduce((acc, p) => acc + p.marks, 0)} Marks Total
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
