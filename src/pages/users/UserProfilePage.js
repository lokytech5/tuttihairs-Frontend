import React, { useState } from 'react'
import UserProfile from '../../components/users/UserProfile'
import axios from 'axios';
import useStore from '../../zustand/store';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function UserProfilePage() {
  // eslint-disable-next-line
  const [formData, setFormData] = useState(null);
  // eslint-disable-next-line
  const [avatarData, setAvatarData] = useState(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(useStore((state) => state.avatarUrl));
      // Get the token from the cookie using js-cookie  
  const token = useStore((state) => state.token);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { userData } = useStore((state) => ({ userData: state.userData }));
  React.useEffect(() => {
    // console.log('userData:', userData);
  }, [userData]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const addUpdateHandler = async (updateData) => {

    try {
      console.log('addupdateHandler userData', updateData);
      const response = await axios.put(`http://localhost:5000/api/users/profile`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      // console.log('addupdateHandler token', token);
      if (response.status === 200 || response.status === 201) {
        setFormData(updateData);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }


  const addUploadAvatar = async (avatarFile) => {

    try {
      // console.log('Sending avatar file:', avatarFile);
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const response = await axios.post(`http://localhost:5000/api/users/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (response.status === 200 || response.status === 201) {
        setAvatarData(avatarFile);
        // Set the avatar URL in the store
        const avatarUrl = response.data.user.avatar // Replace this with the actual property name from the response
        setLocalAvatarUrl(avatarUrl);
        useStore.getState().setAvatarURL(avatarUrl);
      }

    } catch (error) {
      console.log('Error:', error);
    }
  }

  return (
    <>
      <UserProfile
        onAddUpdate={addUpdateHandler}
        onAddAvatar={addUploadAvatar}
        localAvatarUrl={localAvatarUrl} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Profile updated for {userData?.profile?.firstName || 'User'}
        </Alert>
      </Snackbar>
    </>
  )
}
