"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import React from 'react';
import HomeScreen from './components/HomeScreen';
import PatientSelectionScreen from './components/PatientSelectionScreen';

const queryClient = new QueryClient();  

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientSelectionScreen />
      {/* <HomeScreen /> */}
    </QueryClientProvider>
  );
}
