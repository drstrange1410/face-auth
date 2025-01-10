import React, { useState, useEffect } from 'react';
import User from '../components/User';
import { RadioGroup } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';

const defaultAccounts = [];

function UserSelect() {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [selected, setSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      setAccounts(users.length > 0 ? users : defaultAccounts);
      setSelected(users[0] || defaultAccounts[0]);
    } catch (error) {
      console.error('Error loading users:', error);
      setAccounts(defaultAccounts);
      setSelected(defaultAccounts[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId); // Call API to delete the user
      setAccounts((prev) => prev.filter((user) => user.id !== userId));
      if (selected?.id === userId) {
        setSelected(accounts[0] || null); // Update selected user if the deleted user was selected
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user');
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setErrorMessage('No files selected for upload.');
      return;
    }

    let file = files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      setErrorMessage('Only PNG, JPG, or JPEG files are supported.');
      return;
    }

    try {
      const base64 = await convertBase64(file);

      const user = {
        id: 'custom-' + Date.now(),
        fullName: fileName,
        type: 'CUSTOM',
        picture: base64,
      };

      const savedUser = await userService.createUser(user);
      setAccounts((prev) => [...prev, savedUser]);
      setSelected(savedUser);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrorMessage('Failed to save user');
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 w-full max-w-[720px] mx-auto">
      <h1 className="text-2xl font-semibold">Select a User to Log In</h1>
      <div className="w-full p-4">
        <div className="mx-auto w-full max-w-md">
          <RadioGroup value={selected} onChange={setSelected}>
            <RadioGroup.Label className="sr-only">
              Select a User
            </RadioGroup.Label>
            <div className="space-y-2">
              {accounts.map((account) => (
                <User key={account.id} user={account} onDelete={handleDelete} />
              ))}
            </div>
          </RadioGroup>
          <div className="flex flex-col items-center w-full mt-3">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-200 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-indigo-500 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                <p className="font-semibold mb-2 text-sm text-gray-500">
                  Click to upload a picture
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept=".png, .jpg, .jpeg"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
          </div>
          <Link
            to="/login"
            state={{ account: selected }}
            className="mt-4 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-1.5 h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserSelect;
