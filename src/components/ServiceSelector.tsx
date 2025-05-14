import React from 'react';
import { Smartphone, Wifi } from 'lucide-react';

interface ServiceSelectorProps {
  selectedService: 'airtime' | 'data' | null;
  onSelectService: (service: 'airtime' | 'data') => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ selectedService, onSelectService }) => {
  return (
    <div className="simple-card mb-6">
      <h3 className="text-lg font-semibold mb-2 text-[#010101] text-center">Select Service</h3>
      <div className="flex gap-4 justify-center">
        <button
          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-150 bg-white hover:scale-105 focus:outline-none
            ${selectedService === 'airtime' ? 'border-2 border-[#229ED9] text-[#229ED9] font-bold' : 'border-gray-200 text-gray-700'}`}
          onClick={() => onSelectService('airtime')}
        >
          <Smartphone size={28} className="mb-1 text-gray-500" />
          <span className="font-bold text-sm">Airtime</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-150 bg-white hover:scale-105 focus:outline-none
            ${selectedService === 'data' ? 'border-2 border-[#229ED9] text-[#229ED9] font-bold' : 'border-gray-200 text-gray-700'}`}
          onClick={() => onSelectService('data')}
        >
          <Wifi size={28} className="mb-1 text-gray-500" />
          <span className="font-bold text-sm">Data</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceSelector;