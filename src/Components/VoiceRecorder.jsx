import React, { useRef, useState } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { IoIosMicOff } from "react-icons/io";

const VoiceRecorder = ({ onSendAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        const audioUrl = URL.createObjectURL(audioBlob);
        onSendAudio(audioBlob, audioUrl); // send to server and preview locally
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-3 rounded-full ${isRecording ? "bg-red-500" : "bg-blue-500"} text-white`}
      >
        {isRecording ? <FaMicrophoneAlt /> : <IoIosMicOff />}
      </button>
    </div>
  );
};

export default VoiceRecorder;
