const fs = require('fs');
const file = 'c:\\Users\\Learn\\Desktop\\School\\types\\database.types.ts';
let content = fs.readFileSync(file, 'utf8');

const fields = `          first_name_en: string | null
          last_name_en: string | null
          father_name_en: string | null
          student_cnic: string | null`;

const optFields = `          first_name_en?: string | null
          last_name_en?: string | null
          father_name_en?: string | null
          student_cnic?: string | null`;

// Add to Row
content = content.replace(
    "          general_notes: string | null\n          created_at: string",
    "          general_notes: string | null\n" + fields + "\n          created_at: string"
);

// Add to Insert
content = content.replace(
    "          general_notes?: string | null\n          created_at?: string",
    "          general_notes?: string | null\n" + optFields + "\n          created_at?: string"
);

// Add to Update (matches the second instance since we use a regex or string replace which will hit the first but wait, there are two! One for Insert, one for Update).
// To be safe, I'll use regex with global flag or do it twice.
// Let's do it carefully.
let updateMatch = content.match(/general_notes\?: string \| null\n\s*created_at\?: string/g);
if (updateMatch && updateMatch.length >= 2) {
    content = content.replace(
        "          general_notes?: string | null\n          created_at?: string",
        "          general_notes?: string | null\n" + optFields + "\n          created_at?: string"
    );
    // Replace the next one
    content = content.replace(
        "          general_notes?: string | null\n          created_at?: string",
        "          general_notes?: string | null\n" + optFields + "\n          created_at?: string"
    );
}

fs.writeFileSync(file, content, 'utf8');
console.log('Types updated');
