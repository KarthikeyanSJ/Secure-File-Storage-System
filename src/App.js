// src/App.js
import React, { useEffect, useState } from 'react';
import { auth } from './supabase';
import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';


function App() {
  const [user, setUser] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleUpload = (fileData) => {
    // Handle the uploaded file data, e.g., save it to a database
    console.log('File data:', fileData);
  };

  useEffect(() => {
    // Check if a user is already authenticated
    // const session = auth.session();

    // if (session) {
    //   setUser(session.user);
    // }

    // Set up an auth listener
    const { data: listener } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Clean up the listener when the component unmounts
    // return () => {
    //   listener.unsubscribe();
    // };
  }, []);

  const handleLogin = async () => {
    // Redirect to Supabase authentication
    await auth.signUp({ email: 'ssekarthikeyan@gmail.com', password: 'Karthipavi@2023' });
  };

  const handleLogout = async () => {
    // Log out the current user
    await auth.signOut();
  };

  return (
    <div className="App">
      <p>Welcome, !</p>
          <FileUpload onUpload={handleUpload} />

          <div>
        <h2>File Preview</h2>
        {selectedFileId && <FilePreview fileId={selectedFileId} />}
      </div>

      {/* {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <FileUpload onUpload={handleUpload} />

          <div>
        <h2>File Preview</h2>
        {selectedFileId && <FilePreview fileId={selectedFileId} />}
      </div>


          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )} */}
    </div>
  );
}

export default App;
