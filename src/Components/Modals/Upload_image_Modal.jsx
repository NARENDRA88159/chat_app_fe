import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';

import { RxCross2 } from 'react-icons/rx';

export default function UploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = () => {
    if (file && onUpload) {
      onUpload(file);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="bg-white w-full max-w-md mx-auto mt-40 rounded-xl shadow-lg outline-none"
        sx={{ p: 3, position: 'relative' }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
         <RxCross2 />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" className="mb-4 text-center text-gray-800 font-semibold">
          Upload Image
        </Typography>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-[#FFD9C0] file:text-gray-800 hover:file:bg-[#fbcbb0]"
        />

        {/* Preview */}
        {preview && (
          <div className="mb-4 flex justify-center">
            <img src={preview} alt="Preview" className="max-h-60 rounded border shadow" />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-5 mt-4">
          <Button onClick={handleClose} variant="outlined" className="text-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            className="bg-[#114960] hover:bg-[#0d3a47]"
          >
            Upload
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
