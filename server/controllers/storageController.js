const supabase = require('../config/supabaseClient');

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload file to the 'uploads' bucket
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return res.status(200).json({ message: 'File uploaded successfully.', url: publicUrl });

  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Internal server error during file upload.' });
  }
};

module.exports = { uploadFile };
