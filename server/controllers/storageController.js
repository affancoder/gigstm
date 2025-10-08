const supabase = require('../config/supabaseClient');

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Accept bucketName from query string or from multipart form fields (req.body)
  const bucketName = (req.query && req.query.bucketName) || (req.body && req.body.bucketName);
  if (!bucketName) {
    console.error('Missing bucketName. req.query:', req.query, 'req.body:', req.body);
    return res.status(400).json({ error: 'Bucket name is required.' });
  }

  console.log('Received bucketName for upload:', bucketName);

  try {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload file to the specified bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Get the public URL for the uploaded file from the same bucket we uploaded to
    const { data: publicData, error: publicError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (publicError) {
      console.error('Error getting public URL:', publicError);
      // Return success for upload but warn about public URL retrieval
      return res.status(200).json({ message: 'File uploaded successfully, but failed to get public URL.', url: null });
    }

    return res.status(200).json({ message: 'File uploaded successfully.', url: publicData?.publicUrl || null });

  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Internal server error during file upload.' });
  }
};

module.exports = { uploadFile };
