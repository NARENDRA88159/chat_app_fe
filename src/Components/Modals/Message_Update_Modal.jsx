import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { RxCross2 } from "react-icons/rx";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
};

export default function MessageUpdateModal({ open, onClose, onUpdate, value, setValue,selectMessageData }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={style}
                className="bg-white rounded-xl shadow-lg w-80 p-6 flex flex-col items-center"
            >
                <div className="w-full flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Update Message</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <RxCross2 />
                    </button>
                </div>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-4"
                    rows={2}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Edit your message..."
                />
                <div className="w-full flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={()=>onUpdate(selectMessageData)}
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                    >
                        Update
                    </button>
                </div>
            </Box>
        </Modal>
    );
}