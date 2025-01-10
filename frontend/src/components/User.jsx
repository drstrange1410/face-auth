import React from 'react';
import { RadioGroup } from '@headlessui/react';

export default function User({ user, onDelete }) {
  const isBase64 = user.picture && user.picture.startsWith('data:image/');
  const isValidUrl = user.picture && user.picture.startsWith('http');
  const fallbackImage = 'https://via.placeholder.com/50'; // Default fallback image

  const imageSource = isBase64
    ? user.picture // Base64 image
    : isValidUrl
    ? user.picture // Valid URL
    : fallbackImage; // Fallback for invalid/missing images

  return (
    <RadioGroup.Option
      value={user}
      className={({ active, checked }) =>
        `${checked ? 'ring-2 ring-indigo-500' : ''}
          relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
      }
    >
      {({ active, checked }) => (
        <>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={imageSource}
                alt={user.fullName || 'User'}
                onError={(e) => (e.target.src = fallbackImage)} // Fallback if image fails to load
              />
              <div className="ml-4">
                <RadioGroup.Label as="p" className="font-medium text-gray-900">
                  {user.fullName || 'Unnamed User'}
                </RadioGroup.Label>
              </div>
            </div>
            <button
              onClick={() => onDelete(user.id)}
              className="ml-4 text-red-500 hover:text-red-700"
              title="Delete user"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </RadioGroup.Option>
  );
}
