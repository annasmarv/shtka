// Script to generate user.json from data_siswa.json
const fs = require('fs');
const path = require('path');

// Read data_siswa.json
const dataSiswaPath = path.join(__dirname, 'data_siswa.json');
const dataSiswa = JSON.parse(fs.readFileSync(dataSiswaPath, 'utf8'));

// Transform to user.json format
const users = dataSiswa.map(siswa => {
  // Format password: ddmmyyyy from birth_date yyyy-mm-dd
  const [year, month, day] = siswa.birth_date.split('-');
  const password = `${day}${month}${year}`;
  
  return {
    nis: siswa.nis.toString(),
    password: password,
    nama: siswa.nama,
    nisn: siswa.nisn,
    birth_date: siswa.birth_date,
    gender: siswa.gender,
    birth_place: siswa.birth_place,
    url: siswa.url
  };
});

// Write user.json
const userJsonPath = path.join(__dirname, 'user.json');
fs.writeFileSync(userJsonPath, JSON.stringify(users, null, 2));

console.log(`Generated user.json with ${users.length} users`);
