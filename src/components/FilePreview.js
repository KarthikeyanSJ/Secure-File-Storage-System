// src/components/FilePreview.js
import React, { useState, useEffect } from 'react';
import { storage,supabase } from '../supabase';

const FilePreview = ({ fileId }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    // Fetch the file URL from Supabase Storage
    const fetchFileUrl = async () => {
      const { data, error } = await storage
        .from('secure_file_storage') // Replace with your actual bucket name
        .createSignedUrl(`files/${fileId}`, 60); // URL expires in 60 seconds

      if (error) {
        console.error('Error fetching file URL:', error.message);
      } else {
        setFileUrl(data.signedURL);
      }
    };

    fetchFileUrl();
  }, [fileId]);

  return (
    <div>
      {fileUrl ? (
        <img src={fileUrl} alt="File Preview" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Loading preview...</p>
      )}
    </div>
  );
};

export default FilePreview;
