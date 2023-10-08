"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import React, { useState } from 'react';
import HomeScreen from './components/Chat';
import PatientSelectionScreen from './components/PatientSelectionScreen';
import Chat from './components/Chat';

const queryClient = new QueryClient();  

export default function Home() {
  const [patient, setPatient] = useState<{ id: string; name: string } | null>(
    null
  );

  const onSelectPatient = (id: string, name: string) => {
    setPatient({
      id,
      name
    });
  }

  const goBack = () => {
    setPatient(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!patient && <PatientSelectionScreen onSelectPatient={onSelectPatient} />}
      {patient && <Chat patient={patient} goBack={goBack} />}
    </QueryClientProvider>
  );
}
