import React, { useState, useEffect } from 'react';
import { CreditCard, Loader } from 'lucide-react';
import './PurchaseForm.css';

interface PurchaseFormProps {
  network: string;
  service: 'airtime' | 'data';
  onPurchaseComplete: () => void;
}

interface DataPackage {
  id: string;
  name: string;
  size: string;
  price: number;
  duration: string;
}

interface DataType {
  id: string;
  name: string;
}

const networkData = [
  { network: "MTN", network_vtu: 1, network_share: 0, network_sme: 1, network_cg: 1, network_g: 1, plan_id: "1", cash: 0, data_card: 1, recharge_card: 1 },
  { network: "GLO", network_vtu: 1, network_share: 0, network_sme: 0, network_cg: 1, network_g: 1, plan_id: "3", cash: 0, data_card: 0, recharge_card: 0 },
  { network: "AIRTEL", network_vtu: 1, network_share: 0, network_sme: 1, network_cg: 0, network_g: 0, plan_id: "2", cash: 0, data_card: 0, recharge_card: 0 },
  { network: "9MOBILE", network_vtu: 1, network_share: 0, network_sme: 0, network_cg: 1, network_g: 0, plan_id: "4", cash: 0, data_card: 0, recharge_card: 0 }
];

const packagePlans = [
  { id: '2', network: 'MTN', planType: 'SME', size: '1GB', price: 750, duration: '30days', name: '1GB SME' },
  { id: '3', network: 'MTN', planType: 'SME', size: '2GB', price: 1450, duration: '30days', name: '2GB SME' },
  { id: '4', network: 'MTN', planType: 'SME', size: '3GB', price: 2200, duration: '30days', name: '3GB SME' },
  { id: '5', network: 'MTN', planType: 'SME', size: '5GB', price: 4500, duration: '30days', name: '5GB SME' },
  { id: '6', network: 'MTN', planType: 'SME', size: '10GB', price: 9000, duration: '30days', name: '10GB SME' },
  { id: '7', network: 'AIRTEL', planType: 'SME', size: '500MB', price: 493, duration: '7days', name: '500MB SME' },
  { id: '8', network: 'AIRTEL', planType: 'SME', size: '1GB', price: 800, duration: '7days', name: '1GB SME' },
  { id: '9', network: 'AIRTEL', planType: 'SME', size: '2GB', price: 1500, duration: '30days', name: '2GB SME' },
  { id: '10', network: 'AIRTEL', planType: 'SME', size: '4GB', price: 2525, duration: '30days', name: '4GB SME' },
  { id: '11', network: 'GLO', planType: 'GIFTING', size: '1.5GB', price: 460, duration: '30days', name: '1.5GB GIFTING' },
  { id: '12', network: 'GLO', planType: 'GIFTING', size: '2.9GB', price: 940, duration: '30days', name: '2.9GB GIFTING' },
  { id: '13', network: 'GLO', planType: 'GIFTING', size: '4.1GB', price: 1290, duration: '30days', name: '4.1GB GIFTING' },
  { id: '14', network: 'GLO', planType: 'GIFTING', size: '5.8GB', price: 1850, duration: '30days', name: '5.8GB GIFTING' },
  { id: '15', network: 'GLO', planType: 'GIFTING', size: '10GB', price: 3030, duration: '30days', name: '10GB GIFTING' },
  { id: '25', network: '9MOBILE', planType: 'SME', size: '1.1GB', price: 400, duration: '30days', name: '1.1GB SME' },
  { id: '26', network: 'AIRTEL', planType: 'SME', size: '10GB', price: 4000, duration: '30days', name: '10GB SME' },
  { id: '27', network: '9MOBILE', planType: 'GIFTING', size: '1.5GB', price: 880, duration: '30days', name: '1.5GB GIFTING' },
  { id: '28', network: '9MOBILE', planType: 'GIFTING', size: '500MB', price: 450, duration: '30days', name: '500MB GIFTING' },
  { id: '29', network: 'GLO', planType: 'COOPERATE GIFTING', size: '200MB', price: 110, duration: '30days', name: '200MB COOPERATE GIFTING' },
  { id: '30', network: 'GLO', planType: 'COOPERATE GIFTING', size: '500MB', price: 200, duration: '30days', name: '500MB COOPERATE GIFTING' },
  { id: '31', network: 'GLO', planType: 'COOPERATE GIFTING', size: '1GB', price: 400, duration: '30days', name: '1GB COOPERATE GIFTING' },
  { id: '32', network: 'GLO', planType: 'COOPERATE GIFTING', size: '2GB', price: 800, duration: '30days', name: '2GB COOPERATE GIFTING' },
  { id: '33', network: 'GLO', planType: 'COOPERATE GIFTING', size: '3GB', price: 1215, duration: '30days', name: '3GB COOPERATE GIFTING' },
  { id: '34', network: 'GLO', planType: 'COOPERATE GIFTING', size: '5GB', price: 2025, duration: '30days', name: '5GB COOPERATE GIFTING' },
  { id: '35', network: 'GLO', planType: 'COOPERATE GIFTING', size: '10GB', price: 4050, duration: '30days', name: '10GB COOPERATE GIFTING' },
  { id: '36', network: 'MTN', planType: 'GIFTING', size: '6GB', price: 2450, duration: '7days', name: '6GB GIFTING' },
  { id: '37', network: 'MTN', planType: 'GIFTING PROMO', size: '1GB', price: 490, duration: '24hours and 5 mins call', name: '1GB GIFTING PROMO' },
  { id: '38', network: 'MTN', planType: 'GIFTING PROMO', size: '1.5GB', price: 588, duration: '2 days', name: '1.5GB GIFTING PROMO' },
  { id: '39', network: 'MTN', planType: 'GIFTING PROMO', size: '15GB', price: 6305, duration: '30 days', name: '15GB GIFTING PROMO' },
  { id: '41', network: 'MTN', planType: 'GIFTING', size: '10GB', price: 4365, duration: '30days', name: '10GB GIFTING' },
  { id: '43', network: 'MTN', planType: 'GIFTING PROMO', size: '8GB', price: 4365, duration: '7days + 25 min call time', name: '8GB GIFTING PROMO' },
  { id: '44', network: 'AIRTEL', planType: 'SME', size: '300MB', price: 300, duration: '30days', name: '300MB SME' },
  { id: '45', network: 'AIRTEL', planType: 'SME', size: '100MB', price: 100, duration: '30days', name: '100MB SME' },
  { id: '46', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '500MB', price: 137, duration: '30 days', name: '500MB COOPERATE GIFTING' },
  { id: '47', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '1GB', price: 275, duration: '30days', name: '1GB COOPERATE GIFTING' },
  { id: '48', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '2GB', price: 550, duration: '30days', name: '2GB COOPERATE GIFTING' },
  { id: '49', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '3GB', price: 825, duration: '30days', name: '3GB COOPERATE GIFTING' },
  { id: '50', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '4GB', price: 1100, duration: '30days', name: '4GB COOPERATE GIFTING' },
  { id: '51', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '5GB', price: 1375, duration: '30days', name: '5GB COOPERATE GIFTING' },
  { id: '52', network: '9MOBILE', planType: 'COOPERATE GIFTING', size: '10GB', price: 2750, duration: '30days', name: '10GB COOPERATE GIFTING' },
  { id: '53', network: 'AIRTEL', planType: 'COOPERATE GIFTING', size: '500MB', price: 425, duration: '30days', name: '500MB COOPERATE GIFTING' },
  { id: '54', network: 'AIRTEL', planType: 'COOPERATE GIFTING', size: '1GB', price: 850, duration: '30days', name: '1GB COOPERATE GIFTING' },
  { id: '55', network: 'AIRTEL', planType: 'COOPERATE GIFTING', size: '2GB', price: 1700, duration: '30days', name: '2GB COOPERATE GIFTING' },
  { id: '56', network: 'AIRTEL', planType: 'COOPERATE GIFTING', size: '5GB', price: 4250, duration: '30days', name: '5GB COOPERATE GIFTING' },
  { id: '57', network: 'AIRTEL', planType: 'COOPERATE GIFTING', size: '10GB', price: 8500, duration: '30days', name: '10GB COOPERATE GIFTING' },
  { id: '58', network: 'AIRTEL', planType: 'GIFTING', size: '11GB', price: 4000, duration: '30days', name: '11GB GIFTING' },
  { id: '67', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '150MB', price: 60, duration: '1 day', name: '150MB GIFTING PROMO' },
  { id: '69', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '1GB', price: 320, duration: '2 days', name: '1GB GIFTING PROMO' },
  { id: '71', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '3GB', price: 1065, duration: '7 days', name: '3GB GIFTING PROMO' },
  { id: '72', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '7GB', price: 2065, duration: '7days', name: '7GB GIFTING PROMO' },
  { id: '73', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '10GB', price: 3070, duration: '30days', name: '10GB GIFTING PROMO' },
  { id: '74', network: 'AIRTEL', planType: 'SME', size: '25GB', price: 8000, duration: '30days', name: '25GB SME' },
  { id: '75', network: 'AIRTEL', planType: 'SME', size: '18GB', price: 6000, duration: '30days', name: '18GB SME' },
  { id: '76', network: 'GLO', planType: 'GIFTING PROMO', size: '1GB', price: 200, duration: '24hours', name: '1GB GIFTING PROMO' },
  { id: '77', network: 'GLO', planType: 'GIFTING PROMO', size: '2GB', price: 300, duration: '24hours', name: '2GB GIFTING PROMO' },
  { id: '78', network: 'GLO', planType: 'GIFTING PROMO', size: '3.5GB', price: 500, duration: '2 days', name: '3.5GB GIFTING PROMO' },
  { id: '79', network: 'GLO', planType: 'GIFTING PROMO', size: '15GB', price: 1950, duration: '7 days', name: '15GB GIFTING PROMO' },
  { id: '80', network: 'MTN', planType: 'GIFTING PROMO', size: '1.5GB', price: 970, duration: '7 days + 5 mind call time', name: '1.5GB GIFTING PROMO' },
  { id: '81', network: 'MTN', planType: 'GIFTING', size: '1GB', price: 781, duration: 'Weekly and call time', name: '1GB GIFTING' },
  { id: '82', network: 'MTN', planType: 'GIFTING PROMO', size: '250GB', price: 53900, duration: '30days', name: '250GB GIFTING PROMO' },
  { id: '83', network: 'MTN', planType: 'GIFTING PROMO', size: '150GB', price: 34900, duration: '30days', name: '150GB GIFTING PROMO' },
  { id: '84', network: 'MTN', planType: 'GIFTING', size: '75GB', price: 19600, duration: '30days', name: '75GB GIFTING' },
  { id: '85', network: 'MTN', planType: 'GIFTING PROMO', size: '32GB', price: 10780, duration: '10780', name: '32GB GIFTING PROMO' },
  { id: '86', network: 'MTN', planType: 'GIFTING PROMO', size: '35GB', price: 6860, duration: 'Postpaid monthly plan', name: '35GB GIFTING PROMO' },
  { id: '87', network: 'MTN', planType: 'GIFTING PROMO', size: '15GB', price: 6370, duration: '30days and call time', name: '15GB GIFTING PROMO' },
  { id: '88', network: 'MTN', planType: 'GIFTING', size: '12.5GB', price: 5390, duration: '11gb + call time monthly', name: '12.5GB GIFTING' },
  { id: '91', network: 'MTN', planType: 'GIFTING PROMO', size: '3.2GB', price: 980, duration: '2 days', name: '3.2GB GIFTING PROMO' },
  { id: '92', network: 'MTN', planType: 'GIFTING PROMO', size: '2.5GB', price: 735, duration: 'Daily plan', name: '2.5GB GIFTING PROMO' },
  { id: '94', network: 'MTN', planType: 'GIFTING PROMO', size: '1GB', price: 98, duration: 'Beta mix bundle max', name: '1GB GIFTING PROMO' },
  { id: '96', network: 'MTN', planType: 'GIFTING PROMO', size: '75MB', price: 74, duration: 'Daily', name: '75MB GIFTING PROMO' },
  { id: '97', network: 'MTN', planType: 'GIFTING PROMO', size: '0.5MB', price: 49, duration: 'Beta mix mini', name: '0.5MB GIFTING PROMO' },
  { id: '98', network: 'MTN', planType: 'GIFTING PROMO', size: '200GB', price: 49000, duration: '60 days plan', name: '200GB GIFTING PROMO' },
  { id: '100', network: 'MTN', planType: 'GIFTING PROMO', size: '150GB', price: 39200, duration: '60 days plan', name: '150GB GIFTING PROMO' },
  { id: '101', network: 'MTN', planType: 'GIFTING PROMO', size: '40GB', price: 8820, duration: 'Postpaid 2 monthly plan', name: '40GB GIFTING PROMO' },
  { id: '102', network: 'MTN', planType: 'GIFTING PROMO', size: '90GB', price: 24500, duration: '60 days plan', name: '90GB GIFTING PROMO' },
  { id: '103', network: 'MTN', planType: 'GIFTING', size: '7GB', price: 3430, duration: '30days', name: '7GB GIFTING' },
  { id: '104', network: 'MTN', planType: 'GIFTING', size: '3.5GB', price: 2450, duration: '30days + 2gb night', name: '3.5GB GIFTING' },
  { id: '107', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '1GB', price: 320, duration: '3 days', name: '1GB GIFTING PROMO' },
  { id: '108', network: 'MTN', planType: 'GIFTING PROMO', size: '1.2GB', price: 735, duration: '7days pulse', name: '1.2GB GIFTING PROMO' },
  { id: '112', network: 'MTN', planType: 'GIFTING', size: '11GB', price: 3430, duration: '7 days', name: '11GB GIFTING' },
  { id: '113', network: 'MTN', planType: 'GIFTING PROMO', size: '230MB', price: 196, duration: '24hours', name: '230MB GIFTING PROMO' },
  { id: '114', network: 'MTN', planType: 'GIFTING', size: '2GB', price: 1460, duration: '30days + call 2m', name: '2GB GIFTING' },
  { id: '115', network: 'MTN', planType: 'GIFTING', size: '2.7GB', price: 1960, duration: '30days + 2 mins', name: '2.7GB GIFTING' },
  { id: '116', network: 'MTN', planType: 'GIFTING', size: '100MB', price: 98, duration: '24hours', name: '100MB GIFTING' },
  { id: '117', network: 'MTN', planType: 'GIFTING', size: '500MB', price: 490, duration: '7days', name: '500MB GIFTING' },
  { id: '118', network: 'MTN', planType: 'COOPERATE GIFTING', size: '1.8GB', price: 1470, duration: '30days plus 1500 Airtime', name: '1.8GB COOPERATE GIFTING' },
  { id: '120', network: 'MTN', planType: 'COOPERATE GIFTING', size: '300MB', price: 1470, duration: '30days + 1500 talk time', name: '300MB COOPERATE GIFTING' },
  { id: '121', network: 'MTN', planType: 'COOPERATE GIFTING', size: '1GB', price: 2940, duration: '30days + 15000 talk time.', name: '1GB COOPERATE GIFTING' },
  { id: '122', network: 'MTN', planType: 'GIFTING', size: '500MB', price: 346, duration: 'daily', name: '500MB GIFTING' },
  { id: '123', network: 'MTN', planType: 'GIFTING', size: '12.5GB', price: 5390, duration: '30days', name: '12.5GB GIFTING' },
  { id: '124', network: 'MTN', planType: 'GIFTING', size: '14.5GB', price: 4900, duration: '30days', name: '14.5GB GIFTING' },
  { id: '125', network: 'MTN', planType: 'GIFTING', size: '65GB', price: 15680, duration: '30days', name: '65GB GIFTING' },
  { id: '126', network: 'AIRTEL', planType: 'SME', size: '1TB', price: 196000, duration: '1 year', name: '1TB SME' },
  { id: '127', network: 'MTN', planType: 'GIFTING', size: '40MB', price: 50, duration: '1 day and 1 min', name: '40MB GIFTING' },
  { id: '128', network: 'MTN', planType: 'GIFTING', size: '750MB', price: 442, duration: '2 days social', name: '750MB GIFTING' },
  { id: '129', network: 'MTN', planType: 'GIFTING', size: '2GB', price: 735, duration: '2 days', name: '2GB GIFTING' },
  { id: '130', network: 'MTN', planType: 'GIFTING', size: '2.5GB', price: 880, duration: '2 days', name: '2.5GB GIFTING' },
  { id: '131', network: 'MTN', planType: 'GIFTING', size: '3.5GB', price: 1460, duration: '7 days', name: '3.5GB GIFTING' },
  { id: '132', network: 'MTN', planType: 'GIFTING', size: '20GB', price: 5335, duration: '7 days', name: '20GB GIFTING' },
  { id: '133', network: 'MTN', planType: 'GIFTING', size: '6.75GB', price: 2910, duration: '30days', name: '6.75GB GIFTING' },
  { id: '134', network: 'MTN', planType: 'GIFTING', size: '16.5GB', price: 6305, duration: '30 days', name: '16.5GB GIFTING' },
  { id: '135', network: 'MTN', planType: 'GIFTING', size: '24GB', price: 7275, duration: '30 days', name: '24GB GIFTING' },
  { id: '136', network: 'MTN', planType: 'GIFTING', size: '29GB', price: 8730, duration: '30days', name: '29GB GIFTING' },
  { id: '137', network: 'MTN', planType: 'GIFTING', size: '36GB', price: 10670, duration: '30days', name: '36GB GIFTING' },
  { id: '138', network: 'MTN', planType: 'GIFTING', size: '165GB', price: 33950, duration: '30days', name: '165GB GIFTING' },
  { id: '139', network: 'MTN', planType: 'GIFTING', size: '250GB', price: 53350, duration: '30days', name: '250GB GIFTING' },
  { id: '140', network: 'MTN', planType: 'GIFTING', size: '480GB', price: 87300, duration: '90days', name: '480GB GIFTING' },
  { id: '141', network: 'MTN', planType: 'GIFTING', size: '800GB', price: 121250, duration: '1 year', name: '800GB GIFTING' },
  { id: '142', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '100MB', price: 100, duration: '1 day', name: '100MB GIFTING PROMO' },
  { id: '143', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '100GB', price: 20000, duration: '30days mifi', name: '100GB GIFTING PROMO' },
  { id: '144', network: 'AIRTEL', planType: 'GIFTING PROMO', size: '250MB', price: 50, duration: '1 day night Bundle', name: '250MB GIFTING PROMO' },
  { id: '145', network: 'AIRTEL', planType: 'GIFTING', size: '35GB', price: 10000, duration: '30days', name: '35GB GIFTING' },
  { id: '146', network: 'AIRTEL', planType: 'GIFTING', size: '60GB', price: 15000, duration: '30days', name: '60GB GIFTING' },
  { id: '147', network: 'AIRTEL', planType: 'GIFTING', size: '100GB', price: 20000, duration: '30days', name: '100GB GIFTING' },
  { id: '148', network: 'AIRTEL', planType: 'GIFTING', size: '160GB', price: 30000, duration: '30days', name: '160GB GIFTING' },
];

const PurchaseForm: React.FC<PurchaseFormProps> = ({ network, service, onPurchaseComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [dataPackage, setDataPackage] = useState('');
  const [planType, setPlanType] = useState('');
  const [dataPackages, setDataPackages] = useState<DataPackage[]>([]);
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planTypes, setPlanTypes] = useState<{ id: string, name: React.ReactNode }[]>([]);

  useEffect(() => {
    // Reset selections when network or service changes
    setDataPackage('');
    setPlanType('');
    setDataTypes([]);
    
    if (service === 'data' && network) {
      fetchDataPackages();
      updatePlanTypes();
    }
  }, [network, service]);

  useEffect(() => {
    if (planType) {
      fetchDataPackages();
    }
  }, [planType]);

  const updatePlanTypes = () => {
    // Always include these plan types
    const staticTypes = ["SME", "GIFTING", "COOPERATE GIFTING", "GIFTING PROMO"];

    // Find all unique plan types for the selected network in packagePlans
    const typesForNetwork = packagePlans
      .filter(pkg => pkg.network === network)
      .map(pkg => pkg.planType.toUpperCase());

    // Merge static types and found types, remove duplicates
    const uniqueTypes = Array.from(new Set([ ...staticTypes, ...typesForNetwork ]));

    // Add 'ALL' at the top
    const availablePlanTypes = [
      { id: 'ALL', name: <b>ALL</b> },
      ...uniqueTypes.map(type => ({
        id: type,
        name: <b>{type}</b>
      }))
    ];

    setPlanTypes(availablePlanTypes);
  };

  const fetchDataPackages = async () => {
    if (!network || !planType) return;

    setIsLoading(true);
    setError(null);

    try {
      let filteredPackages;
      if (planType === 'ALL') {
        filteredPackages = packagePlans.filter(
          pkg => pkg.network.toLowerCase() === network.toLowerCase()
        );
      } else {
        filteredPackages = packagePlans.filter(
          pkg => pkg.network.toLowerCase() === network.toLowerCase() &&
                 pkg.planType.toUpperCase() === planType
        );
      }
      setDataPackages(filteredPackages);
    } catch (err) {
      setError('Failed to fetch data packages. Please try again.');
      console.error('Error fetching data packages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Purchase submitted:', { 
      network, 
      service, 
      phoneNumber, 
      amount, 
      dataPackage,
      planType
    });
    
    setTimeout(() => {
      alert('Purchase successful!');
      onPurchaseComplete();
    }, 1000);
  };

  return (
    <div className="simple-bg flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md mx-auto mt-8 mb-8">
        <div className="simple-card">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {service === 'airtime' && (
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-modern"
                  placeholder="Enter amount"
                  required
                />
              </div>
            )}

            {service === 'data' && (
              <>
                <div>
                  <label htmlFor="planType" className="block text-sm font-semibold text-gray-700 mb-1">
                    Plan Type
                  </label>
                  <select
                    id="planType"
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="input-modern"
                    required
                  >
                    <option value="">Select a plan type</option>
                    {planTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dataPackage" className="block text-sm font-semibold text-gray-700 mb-1">
                    Data Plan
                  </label>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader className="animate-spin text-blue-500 mr-2" size={20} />
                      <span className="text-sm text-gray-500">Loading packages...</span>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-sm p-2 rounded bg-red-50 border border-red-200">{error}</div>
                  ) : (
                    <select
                      id="dataPackage"
                      value={dataPackage}
                      onChange={(e) => setDataPackage(e.target.value)}
                      className="input-modern"
                      required
                    >
                      <option value="">Select a package</option>
                      {dataPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.size} {pkg.name} = ₦{pkg.price.toFixed(2)} {pkg.duration}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-modern"
                placeholder="e.g. 08012345678"
                required
              />
            </div>

            <button
              type="submit"
              disabled={service === 'data' && (isLoading || !dataPackage || !planType)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-150 bg-white hover:scale-105 focus:outline-none
              ${service === 'data' && (isLoading || !dataPackage || !planType) ? ' cursor-not-allowed' : 'hover:shadow-lg'}`}>
              <span>Purchase {service === 'airtime' ? 'Airtime' : 'Data'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;