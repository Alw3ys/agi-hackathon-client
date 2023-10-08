import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Patient = {
  name: string;
  id: string;
};

const PatientSelectionScreen: React.FC<any> = ({
  onSelectPatient,
}: {
  onSelectPatient: (id: string, name: string) => void;
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // ...
        const data = {
          patients: [
            { id: "1234", name: "John Doe" },
            { id: "1234123112", name: "Jane asdkasd" },
            { id: "12321", name: "Felipe aaa" },
          ],
        };
        // ...
        setPatients(data.patients);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="space-y-4">
          {patients.map((patient) => (
            <li key={patient.id} className="list-none">
              <button
                className="text-left w-full text-lg py-2 px-4 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 ease-in-out rounded-lg"
                onClick={() => onSelectPatient(patient.id, patient.name)}
              >
                {patient.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientSelectionScreen;
