const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

(async () => {
  try {
    const token = require('jsonwebtoken').sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'accesssecret');

    // 1) create lecture
    const createRes = await axios.post('http://localhost:5000/api/commands/lectures', { courseId: 1, title: 'Temp Test Lecture' }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Created lecture:', createRes.data);
    const lectureId = createRes.data.id || createRes.data.lectureId;
    if (!lectureId) throw new Error('No lectureId from create');

    // 2) upload file for that lecture, appending lectureId before file
    const filePath = path.join(__dirname, 'test-create-upload.txt');
    fs.writeFileSync(filePath, 'create then upload');

    const form = new FormData();
    form.append('lectureId', String(lectureId));
    form.append('file', fs.createReadStream(filePath));

    const res = await axios.post('http://localhost:5000/api/commands/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('Upload response:', res.status, res.data);
  } catch (err) {
    console.error('Error in test:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
