const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

(async () => {
  try {
    const filePath = path.join(__dirname, 'test-upload.txt');
    fs.writeFileSync(filePath, 'hello');

  const form = new FormData();
  // append lectureId before file so multer destination sees it
  form.append('lectureId', '1');
  form.append('file', fs.createReadStream(filePath));

  const token = require('jsonwebtoken').sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'accesssecret');

    const res = await axios.post('http://localhost:5000/api/commands/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('Upload response status:', res.status);
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.error('Upload error:', err.response.status, err.response.data);
    } else {
      console.error('Upload error:', err.message);
    }
    process.exit(1);
  }
})();
