import { useMediaQuery } from "@mui/material";
import clsx from "clsx";
import { useEffect, useState } from "react";

const Chat: React.FC<any> = ({
  patient,
  goBack,
}: {
  patient: { id: string; name: string };
  goBack: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
      setIsLoading(true);

      try {
          console.log('Sending message:', message);
          const response = await fetch(`http://127.0.0.1:8000/chat?question=${message}`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json'
              }
          });

          if (!response.ok) {
              console.error('Response not ok:', response);
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Received data:', data);

          // ... handle the data ...
      } catch (error) {
          console.error('Error sending message:', error);
          setResponse("Error connecting to the server.");
      } finally {
          setIsLoading(false);
      }
  };


  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 text-center text-gray-800 fixed top-0 w-full z-10 rounded-b-lg shadow-md flex items-center">
        <button onClick={goBack} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div className="flex-grow text-center">{patient.name}</div>
        <div className="ml-auto mr-2">
          {/* This empty div balances out the back button and keeps the patient name centered */}
        </div>
      </div>
      <div className="mt-16 mb-16 overflow-y-auto p-4">{response}</div>
      <div className="bg-white p-2 fixed bottom-0 w-full flex items-center rounded-t-lg shadow-md">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow rounded-lg p-2 border border-gray-300 mr-2 resize-none"
          placeholder="Type your message"
        />
        <button
          onClick={handleSendMessage}
          className={`bg-gray-300 text-gray-800 rounded-lg px-4 py-2 relative ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.21.896 4.33 2.516 5.877l1.484-1.586z"
                ></path>
              </svg>
            ) : null}
          </div>
          <span
            className={`transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            Send
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
