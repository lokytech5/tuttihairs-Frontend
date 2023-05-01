import React from 'react'
import UserSetting from '../../components/users/UserSetting'
import axios from 'axios'
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';



export default function UserSettingPage() {
  const userId = useStore((state) => state.userId);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const token = useStore((state) => state.token);
  const navigate = useNavigate()
  // Snackbar states for success and failure
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = React.useState(false);
  // Snackbar states for savePreferences
  const [preferencesSuccessSnackbarOpen, setPreferencesSuccessSnackbarOpen] = React.useState(false);
  const [preferencesFailureSnackbarOpen, setPreferencesFailureSnackbarOpen] = React.useState(false);

  const onSuccess = () => {
    console.log('Password verification successful');
    setSuccessSnackbarOpen(true);
    setTimeout(() => {
      navigate('/');
    }, 2000); // Redirect to homepage after 6 seconds
  };

  const onFailure = () => {
    console.error('Password verification failed');
    setFailureSnackbarOpen(true);
  };

  // Snackbar close handlers
  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const handleFailureSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFailureSnackbarOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePreferencesSuccessSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPreferencesSuccessSnackbarOpen(false);
  };

  const addChangePasswordHandler = async (changePasswordData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/verify-password`, {
        userId,
        currentPassword: changePasswordData.currentPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('changePassword', changePasswordData);
      console.log('verify-password', changePasswordData.currentPassword)

      if (response.status === 200 || response.status === 201) {
        const updateResponse = await axios.put(`http://localhost:5000/api/users/${userId}`, {
          password: changePasswordData.newPassword,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (updateResponse.status === 200 || updateResponse.status === 201) {
          const updatedUser = await updateResponse.data;
          console.log('Password updated successfully:', updatedUser);
          setOpenSnackbar(true);
        } else {
          console.error('Error updating password:', updateResponse.data);
        }
      } else {
        console.error('Error verifying current password:', response.data);
      }

    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('User deleted successfully:', response.data);
        // Perform any additional actions, such as redirecting to a different page, etc.
        onSuccess();
      } else {
        console.error('Error deleting user:', response.data);
      }
    } catch (error) {
      console.log('Error deleting account: ', error);
    }
  }

  const verifyPasswordBeforeDeletion = async (password) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/verify-password`, {
        userId,
        currentPassword: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        // Password is correct, proceed with user deletion

        deleteAccount();
      } else {
        console.error('Error verifying current password:', response.data);
      }
    } catch (error) {
      console.log('Error: ', error);
      onFailure();
    }

  }

  const handlePreferencesFailureSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPreferencesFailureSnackbarOpen(false);
  };

  const addNotificationPreferenceHandler = async (notificationData) => {
    try {

      const response = await axios.put(`http://localhost:5000/api/users/notification`, notificationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('User deleted successfully:', response.data);
        // Perform any additional actions, such as redirecting to a different page, etc.
        setPreferencesSuccessSnackbarOpen(true);
      }

    } catch (error) {
      console.log('Error saving preference: ', error);
      setPreferencesFailureSnackbarOpen(true);
    }
  }

  return (
    <UserSetting
      onVerifyAndUpdatePassword={addChangePasswordHandler}
      openSnackbar={openSnackbar}
      handleSnackbarClose={handleSnackbarClose}
      onDeleteAccount={verifyPasswordBeforeDeletion}
      successSnackbarOpen={successSnackbarOpen}
      failureSnackbarOpen={failureSnackbarOpen}
      handleSuccessSnackbarClose={handleSuccessSnackbarClose}
      handleFailureSnackbarClose={handleFailureSnackbarClose}
      notificationPreference={addNotificationPreferenceHandler}
      preferencesSuccessSnackbarOpen={preferencesSuccessSnackbarOpen}
      handlePreferencesSuccessSnackbarClose={handlePreferencesSuccessSnackbarClose}
      preferencesFailureSnackbarOpen={preferencesFailureSnackbarOpen}
      handlePreferencesFailureSnackbarClose={handlePreferencesFailureSnackbarClose} />
  )
}
