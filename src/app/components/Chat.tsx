import { useMediaQuery } from "@mui/material";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import moment from "moment";

type ChatResponse = {
  text: string;
  payload?: TrendableValue[];
};

type TrendableValue = {
  timestamp: string;
  value: number;
  unit: string;
};

const Chat: React.FC<any> = ({
  patient,
  goBack,
}: {
  patient: { id: string; name: string };
  goBack: () => void;
}) => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<ChatResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGraphFor, setShowGraphFor] = useState<number[]>([]);
  const [graphWidth, setGraphWidth] = useState(0);
  const graphContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.offsetWidth - 100);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderLineChart = (payload: TrendableValue[]) => (
    <LineChart width={graphWidth} height={400} data={payload}>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis
        dataKey="timestamp"
        tickFormatter={(tickItem) => moment(tickItem).format("YYYY-MM-DD")}
      />
      <YAxis />
      <Tooltip />
    </LineChart>
  );

  const handleSendMessage = async () => {
    setIsLoading(true);
    // Logic to send message to server
    // Assume the function sendMessageToServer exists and updates the response
    // await sendMessageToServer(message).then(res => setResponse(res));

    const newResponse: ChatResponse = {
      text: "Here is the graph for the patients heart rate. ",
      payload: [
        {
          timestamp: "2023-10-07T00:00:00",
          value: 70,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:05:00",
          value: 75,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:10:00",
          value: 80,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:15:00",
          value: 85,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:20:00",
          value: 90,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:25:00",
          value: 95,
          unit: "bpm",
        },
        {
          timestamp: "2023-10-07T00:30:00",
          value: 100,
          unit: "bpm",
        },
      ],
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setResponses((prevResponses) => [...prevResponses, newResponse]); // Append new response to existing list
    setIsLoading(false);
  };

  const toggleGraph = (index: number) => {
    setShowGraphFor((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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
      <div className="mt-16 mb-16 overflow-y-auto p-4" ref={graphContainerRef}>
        {responses.map((res, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <p className="my-4">{res.text}</p>
            {res.payload && res.payload.length > 0 && (
              <table className="min-w-full bg-white rounded-lg shadow-md text-gray-800 border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Timestamp
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Value
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {res.payload.slice(0, 10).map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-2 px-4 border-b border-gray-200">
                        {item.timestamp}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {item.value}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {res.payload && res.payload.length > 2 && (
              <button
                onClick={() => toggleGraph(index)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
              >
                {showGraphFor.includes(index) ? "Hide Graph" : "Show Graph"}
              </button>
            )}
            {showGraphFor.includes(index) && (
              <div className="graph-section">
                {renderLineChart(res.payload || [])}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-white p-2 fixed bottom-0 w-full flex items-center rounded-t-lg shadow-md">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow rounded-lg p-2 border border-gray-300 mr-2 resize-none"
          placeholder="Type your message"
        />
        <button
          onClick={handleSendMessage}
          className={` bg-blue-500 text-white rounded-lg px-4 py-2 relative ${
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
            className={`transition-opacity duration-300${
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
