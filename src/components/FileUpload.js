// src/components/FileUpload.js
import React, { useState, useEffect } from 'react';
import { storage,supabase } from '../supabase';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch and display the list of uploaded files
    const fetchFiles = async () => {
      const { data, error } = await storage
        .from('secure_file_storage') // Replace with your actual bucket name
        .list('files/');

      if (error) {
        console.error('Error fetching files:', error.message);
      } else {
        setFileList(data);
      }
    };

    fetchFiles();
  }, []); // Run only once on component mount

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  
  const handleShare = async (fileId, shareWithEmail) => {
    // Fetch the file details from Supabase Storage
    const { data: fileDetails, error: fileError } = await storage
      .from('secure_file_storage') // Replace with your actual bucket name
      .getMetadata(`files/${fileId}`);

    if (fileError) {
      console.error('Error fetching file details:', fileError.message);
      return;
    }
    const { data: user, error: userError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', shareWithEmail)
    .single();

  if (userError) {
    console.error('Error fetching user details:', userError.message);
    return;
  }

  // Grant permission to the specified user for the file
  const { error: grantError } = await supabase
    .from('storage.buckets')
    .upsert([
      {
        bucket_id: 'your_bucket_id', // Replace with your actual bucket ID
        grantee: user.id,
        permissions: ['read'], // Adjust permissions as needed
        path: `files/${fileId}`,
      },
    ]);

  if (grantError) {
    console.error('Error granting permission to the user:', grantError.message);
  } else {
    console.log('File shared successfully with user:', shareWithEmail);
  }
};

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setUploading(true);

    // Upload the file to Supabase Storage
    const { data, error } = await storage
      .from('secure_file_storage') // Replace with your actual bucket name
      .upload(`files/${file.name}`, file);

    setUploading(false);

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      console.log('File uploaded successfully:', data);
      onUpload(data); // Pass the uploaded file data to the parent component

      // Update the file list
      setFileList([...fileList, data]);
    }
  };

  const handleDelete = async (fileId) => {
    const user = supabase.auth.user();

    // Check if the user has the 'admin' role
    const { data: roles, error } = await supabase
      .from('auth.users')
      .select('role')
      .eq('id', user.id);

    if (error) {
      console.error('Error fetching user roles:', error.message);
      return;
    }

    const isAdmin = roles?.[0]?.role === 'admin';

    if (!isAdmin) {
      console.error('User does not have permission to delete files');
      return;
    }

    // Delete the file from Supabase Storage
    const storageResult = await storage
      .from('secure_file_storage') // Replace with your actual bucket name
      .remove(`files/${fileId}`);

    if (storageResult.error) {
      console.error('Error deleting file from storage:', storageResult.error.message);
      return;
    }

    // Delete the file metadata from the database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('Error deleting file metadata from database:', dbError.message);
    } else {
      console.log('File deleted successfully:', fileId);

      // Update the file list
      setFileList(fileList.filter((file) => file.id !== fileId));
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        Upload
      </button>

      <ul>
        {fileList.map((file) => (
          <li key={file.id}>
            {file.name}{' '}
            <button onClick={() => handleDelete(file.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
      <h3>Share File</h3>
      <input
        type="text"
        placeholder="Enter email to share with"
        onChange={(e) => setShareEmail(e.target.value)}
      />
      <button onClick={() => handleShare(selectedFileId, shareEmail)}>
        Share File
      </button>
    </div>

    </div>
  );
};

export default FileUpload;
