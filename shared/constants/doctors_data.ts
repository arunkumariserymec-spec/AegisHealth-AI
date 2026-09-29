/**
 * Healthcare Providers and Emergency Hospitals Dataset for India
 * Verified institutions, emergency 24/7 care, contact numbers, and specialties
 */

import { Doctor, Hospital } from '../types';

export const MASTER_DOCTORS: Doctor[] = [
  // Ballari / Bellary Region
  {
    id: 'doc_blr_01',
    name: 'Dr. Suresh Patil, MBBS, MD (Medicine)',
    specialty: 'General Physician',
    experienceYears: 16,
    qualification: 'MD - Internal Medicine, VIMS Bellary',
    hospital: 'Vijayanagar Institute of Medical Sciences (VIMS) Hospital',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Cantonment Main Road, Near VIMS College Campus, Ballari 583104',
    phone: '+91 8392 235201',
    rating: 4.8,
    consultationFee: 350,
    availability: 'Mon - Sat: 9:00 AM - 2:00 PM, 5:00 PM - 8:30 PM',
    languages: ['Kannada', 'Telugu', 'Hindi', 'English']
  },
  {
    id: 'doc_blr_02',
    name: 'Dr. Rajeshwari K., MBBS, MD, DM (Cardiology)',
    specialty: 'Cardiologist',
    experienceYears: 14,
    qualification: 'DM - Cardiology, Sri Jayadeva Institute of Cardiology',
    hospital: 'Jindal Sanjeevani Multi-Specialty Hospital',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Vidyanagar Township, Toranagallu, Ballari District 583123',
    phone: '+91 8395 250100',
    rating: 4.9,
    consultationFee: 600,
    availability: 'Mon - Fri: 10:00 AM - 4:00 PM',
    languages: ['Kannada', 'English', 'Hindi', 'Telugu']
  },
  {
    id: 'doc_blr_03',
    name: 'Dr. Mohammed Arif, MBBS, DCH, MD (Pediatrics)',
    specialty: 'Pediatrician',
    experienceYears: 12,
    qualification: 'MD - Pediatrics, KIMS Hubballi',
    hospital: 'St. Mary’s Children & Multi-Specialty Clinic',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Car Street, Opp. Municipal High School, Ballari 583101',
    phone: '+91 8392 272445',
    rating: 4.7,
    consultationFee: 400,
    availability: 'Daily: 10:00 AM - 1:30 PM, 6:00 PM - 9:00 PM',
    languages: ['Kannada', 'Urdu', 'Telugu', 'English']
  },
  {
    id: 'doc_blr_04',
    name: 'Dr. Ananya Rao, MBBS, DDVL, MD (Dermatology)',
    specialty: 'Dermatologist',
    experienceYears: 10,
    qualification: 'MD - Dermatology, Bangalore Medical College',
    hospital: 'Skin & Laser Care Centre',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Near Royal Circle, Infantry Road, Ballari 583103',
    phone: '+91 8392 268910',
    rating: 4.8,
    consultationFee: 450,
    availability: 'Mon - Sat: 10:30 AM - 2:00 PM, 5:30 PM - 8:00 PM',
    languages: ['Kannada', 'Telugu', 'English']
  },
  {
    id: 'doc_blr_05',
    name: 'Dr. Prashanth Reddy, MBBS, MS (Orthopedics)',
    specialty: 'Orthopedic',
    experienceYears: 15,
    qualification: 'MS - Ortho, PGIMER Chandigarh',
    hospital: 'Ballari Trauma & Bone Care Hospital',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Station Road, Brucepet, Ballari 583101',
    phone: '+91 8392 240555',
    rating: 4.8,
    consultationFee: 500,
    availability: 'Mon - Sat: 9:30 AM - 1:00 PM, 4:30 PM - 7:30 PM',
    languages: ['Kannada', 'Telugu', 'English', 'Hindi']
  },

  // Bengaluru Region
  {
    id: 'doc_bgl_01',
    name: 'Dr. Arvind Sharma, MBBS, MD, MRCP (UK)',
    specialty: 'General Physician',
    experienceYears: 20,
    qualification: 'MD Internal Medicine (BMCRI), MRCP (London)',
    hospital: 'Manipal Hospital Bengaluru',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '98, HAL Old Airport Road, Kodihalli, Bengaluru 560017',
    phone: '+91 80 2502 4444',
    rating: 4.9,
    consultationFee: 850,
    availability: 'Mon - Sat: 9:00 AM - 3:00 PM',
    languages: ['English', 'Kannada', 'Hindi']
  },
  {
    id: 'doc_bgl_02',
    name: 'Dr. Preeti Deshmukh, MBBS, MD, DM (Cardiology)',
    specialty: 'Cardiologist',
    experienceYears: 18,
    qualification: 'DM Cardiology, AIIMS New Delhi',
    hospital: 'Fortis Hospital Bannerghatta Road',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '154/9, Bannerghatta Road, Opp. IIM-B, Bengaluru 560076',
    phone: '+91 80 6621 4444',
    rating: 4.9,
    consultationFee: 1100,
    availability: 'Mon - Fri: 10:00 AM - 5:00 PM',
    languages: ['English', 'Hindi', 'Marathi', 'Kannada']
  },
  {
    id: 'doc_bgl_03',
    name: 'Dr. Vikramaditya Gowda, MBBS, DTCD, DNB (Pulmonology)',
    specialty: 'Pulmonologist',
    experienceYears: 14,
    qualification: 'DNB Respiratory Medicine, BMCRI',
    hospital: 'Apollo Hospitals Sheshadripuram',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '1, Old 28, Platform Road, Near Mantri Mall, Bengaluru 560020',
    phone: '+91 80 4668 8888',
    rating: 4.8,
    consultationFee: 900,
    availability: 'Mon - Sat: 11:00 AM - 4:00 PM',
    languages: ['Kannada', 'English', 'Hindi']
  },
  {
    id: 'doc_bgl_04',
    name: 'Dr. Sunita Kulkarni, MBBS, MS, DGO',
    specialty: 'Gynecologist',
    experienceYears: 19,
    qualification: 'MS Obstetrics & Gynecology, KMC Manipal',
    hospital: 'Cloudnine Hospital Jayanagar',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '1533, 9th Main Road, 3rd Block, Jayanagar, Bengaluru 560011',
    phone: '+91 80 4020 2222',
    rating: 4.9,
    consultationFee: 800,
    availability: 'Mon - Sat: 10:00 AM - 2:00 PM, 5:00 PM - 7:30 PM',
    languages: ['Kannada', 'English', 'Hindi', 'Marathi']
  },

  // Hyderabad Region
  {
    id: 'doc_hyd_01',
    name: 'Dr. Venkat Raman Rao, MBBS, MD (General Medicine)',
    specialty: 'General Physician',
    experienceYears: 17,
    qualification: 'MD Internal Medicine, Osmania Medical College',
    hospital: 'Yashoda Hospitals Somajiguda',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Raj Bhavan Road, Matha Nagar, Somajiguda, Hyderabad 500082',
    phone: '+91 40 4567 4567',
    rating: 4.8,
    consultationFee: 750,
    availability: 'Mon - Sat: 9:30 AM - 3:30 PM',
    languages: ['Telugu', 'Hindi', 'English']
  },
  {
    id: 'doc_hyd_02',
    name: 'Dr. Srinivas Reddy, MBBS, MS, MCh (Surgical Gastro)',
    specialty: 'Gastroenterologist',
    experienceYears: 16,
    qualification: 'MCh Surgical Gastroenterology, NIMS Hyderabad',
    hospital: 'Apollo Hospitals Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No 72, Opp. Bharatiya Vidya Bhavan, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 2360 7777',
    rating: 4.9,
    consultationFee: 1000,
    availability: 'Mon - Fri: 10:00 AM - 4:00 PM',
    languages: ['Telugu', 'English', 'Hindi']
  },

  // Chennai Region
  {
    id: 'doc_chn_01',
    name: 'Dr. Meenakshi Sundaram, MBBS, MD, DM (Cardiology)',
    specialty: 'Cardiologist',
    experienceYears: 22,
    qualification: 'DM Cardiology, Madras Medical College',
    hospital: 'Apollo Hospitals Greams Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '21 Greams Lane, Thousand Lights, Chennai 600006',
    phone: '+91 44 2829 0200',
    rating: 4.9,
    consultationFee: 1000,
    availability: 'Mon - Sat: 9:00 AM - 1:00 PM',
    languages: ['Tamil', 'English']
  },
  {
    id: 'doc_chn_02',
    name: 'Dr. Karthik S., MBBS, DLO, MS (ENT)',
    specialty: 'ENT',
    experienceYears: 13,
    qualification: 'MS ENT, Stanley Medical College Chennai',
    hospital: 'KIMS Health & ENT Institute',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Arcot Road, Vadapalani, Chennai 600026',
    phone: '+91 44 4928 2828',
    rating: 4.7,
    consultationFee: 650,
    availability: 'Mon - Sat: 10:00 AM - 6:00 PM',
    languages: ['Tamil', 'English']
  }
];

export const MASTER_HOSPITALS: Hospital[] = [
  // Ballari / Bellary
  {
    id: 'hosp_blr_01',
    name: 'Vijayanagar Institute of Medical Sciences (VIMS) Teaching Hospital',
    type: 'Teaching / Medical College',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Cantonment Main Road, Ballari, Karnataka 583104',
    emergencyPhone: '108 / +91 8392 235201',
    generalPhone: '+91 8392 235202',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 2.4
  },
  {
    id: 'hosp_blr_02',
    name: 'District Government Hospital Ballari',
    type: 'Government',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'Ananthapur Road, Cowl Bazaar, Ballari 583102',
    emergencyPhone: '108 / +91 8392 242222',
    generalPhone: '+91 8392 242223',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 3.8
  },
  {
    id: 'hosp_blr_03',
    name: 'Jindal Sanjeevani Multi-Specialty Hospital',
    type: 'Private Multi-Specialty',
    city: 'Ballari (Bellary)',
    state: 'Karnataka',
    address: 'JSW Steel Complex, Vidyanagar Township, Toranagallu, Ballari District 583123',
    emergencyPhone: '+91 8395 250100',
    generalPhone: '+91 8395 250101',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 28.5
  },

  // Bengaluru
  {
    id: 'hosp_bgl_01',
    name: 'Manipal Hospital Old Airport Road',
    type: 'Private Multi-Specialty',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '98, HAL Old Airport Road, Kodihalli, Bengaluru 560017',
    emergencyPhone: '080 2222 1111',
    generalPhone: '+91 80 2502 4444',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 6.2
  },
  {
    id: 'hosp_bgl_02',
    name: 'Victoria Hospital (BMCRI Campus)',
    type: 'Teaching / Medical College',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
    emergencyPhone: '108 / 080 2670 1150',
    generalPhone: '080 2670 1151',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 4.1
  },
  {
    id: 'hosp_bgl_03',
    name: 'Apollo Hospital Bannerghatta Road',
    type: 'Private Multi-Specialty',
    city: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    address: '154/9, Opp. IIM Bangalore, Bannerghatta Road, Bengaluru 560076',
    emergencyPhone: '1066',
    generalPhone: '+91 80 2630 4050',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 9.8
  },

  // Hyderabad
  {
    id: 'hosp_hyd_01',
    name: 'Apollo Hospitals Jubilee Hills',
    type: 'Private Multi-Specialty',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No 72, Film Nagar, Jubilee Hills, Hyderabad 500033',
    emergencyPhone: '1066 / +91 40 2360 7777',
    generalPhone: '+91 40 2360 7777',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 5.5
  },
  {
    id: 'hosp_hyd_02',
    name: 'Nizam’s Institute of Medical Sciences (NIMS)',
    type: 'Teaching / Medical College',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    emergencyPhone: '108 / +91 40 2348 9000',
    generalPhone: '+91 40 2348 9244',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 3.2
  },

  // Chennai
  {
    id: 'hosp_chn_01',
    name: 'Apollo Hospitals Main Greams Road',
    type: 'Private Multi-Specialty',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '21 Greams Lane, Off Greams Road, Chennai 600006',
    emergencyPhone: '1066 / +91 44 2829 0200',
    generalPhone: '+91 44 2829 3333',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 4.8
  },
  {
    id: 'hosp_chn_02',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH / MMC)',
    type: 'Teaching / Medical College',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'EVR Periyar Salai, Park Town, Chennai 600003',
    emergencyPhone: '108 / +91 44 2530 5000',
    generalPhone: '+91 44 2530 5111',
    is24x7Emergency: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    distanceKm: 2.1
  }
];

export const EMERGENCY_HELPLINES_INDIA = [
  { name: 'National Emergency Toll-Free Number', number: '112', description: 'All-in-one emergency service across India' },
  { name: 'National Ambulance Service', number: '108', description: 'Immediate 24x7 free emergency ambulance response' },
  { name: 'Maternal & Child Health Ambulance', number: '102', description: 'Dedicated obstetric & infant transport' },
  { name: 'National Health Helpline', number: '1075', description: 'Ministry of Health & Family Welfare assistance' },
  { name: 'Apollo Emergency Hotline', number: '1066', description: 'Private emergency response network' }
];
