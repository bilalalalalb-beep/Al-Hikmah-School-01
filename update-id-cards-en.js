const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\components\\students\\id-cards-desk.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetName = "      const fullName = `${student.first_name} ${student.last_name || ''}`.trim();";
const replaceName = "      const fullName = lang === 'en'\n        ? `${student.first_name_en || student.first_name} ${student.last_name_en || student.last_name || ''}`.trim()\n        : `${student.first_name} ${student.last_name || ''}`.trim();\n      const fatherName = lang === 'en' ? (student.father_name_en || student.father_name) : student.father_name;";
if(content.includes(targetName)) content = content.replace(targetName, replaceName);

const targetFather = "              <div>${student.father_name}</div>";
const replaceFather = "              <div>${fatherName}</div>";
if(content.includes(targetFather)) content = content.replace(targetFather, replaceFather);

// Now update the search filter to also search by English name
const searchTarget = "    const fullName = `${s.first_name} ${s.last_name || ''}`.trim().toLowerCase();";
const searchReplace = "    const fullName = `${s.first_name} ${s.last_name || ''}`.trim().toLowerCase();\n    const fullNameEn = `${s.first_name_en || ''} ${s.last_name_en || ''}`.trim().toLowerCase();";
if(content.includes(searchTarget)) content = content.replace(searchTarget, searchReplace);

const searchConditionTarget = "fullName.includes(term) ||";
const searchConditionReplace = "fullName.includes(term) || fullNameEn.includes(term) ||";
if(content.includes(searchConditionTarget)) content = content.replace(searchConditionTarget, searchConditionReplace);

fs.writeFileSync(file, content, 'utf8');
console.log('ID Cards updated for EN names');
