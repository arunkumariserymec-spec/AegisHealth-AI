import React, { useState, useEffect } from 'react';
import { Doctor, Hospital, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import {
  Building2,
  PhoneCall,
  MapPin,
  Star,
  Search,
  Filter,
  Clock,
  Award,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DoctorFinderViewProps {
  language: SupportedLanguage;
  onOpenSOS: () => void;
}

export const DoctorFinderView: React.FC<DoctorFinderViewProps> = ({
  language,
  onOpenSOS
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationPermitted, setLocationPermitted] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [selectedSpecialty, selectedCity]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const docRes = await fetch(`/api/doctors/nearby?specialty=${encodeURIComponent(selectedSpecialty)}&city=${encodeURIComponent(selectedCity)}`);
      if (docRes.ok) {
        const docData = await docRes.json();
        setDoctors(Array.isArray(docData) ? docData : []);
      }

      const hospRes = await fetch(`/api/hospitals/nearby?city=${encodeURIComponent(selectedCity)}`);
      if (hospRes.ok) {
        const hospData = await hospRes.json();
        setHospitals(Array.isArray(hospData?.hospitals) ? hospData.hospitals : []);
      }
    } catch (e) {
      console.error('Failed to load healthcare providers:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLocation = () => {
    setLocationNotice(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationPermitted(true);
          setSelectedCity('Ballari (Bellary)');
          setLocationNotice('Set nearest healthcare city to Ballari (Bellary).');
        },
        (err) => {
          setLocationPermitted(false);
          setLocationNotice('Location permission not granted. You can filter by city manually.');
        }
      );
    } else {
      setLocationNotice('Geolocation is not supported by your browser.');
    }
  };

  const filteredDoctors = doctors.filter(d => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredHospitals = hospitals.filter(h => {
    if (emergencyOnly && !h.is24x7Emergency) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Location Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t.findDoctors}</h1>
            <p className="text-xs text-slate-500">
              Verified clinical healthcare providers, emergency hospitals, and medical colleges in India
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!locationPermitted ? (
              <button
                onClick={handleRequestLocation}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Use My Location (With Permission)</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Location Active: Ballari / Karnataka</span>
              </span>
            )}
            <button
              onClick={onOpenSOS}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>108 Hotline</span>
            </button>
          </div>
        </div>

        {locationNotice && (
          <div className="p-2.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center justify-between">
            <span>{locationNotice}</span>
            <button onClick={() => setLocationNotice(null)} className="text-xs font-bold text-teal-900 underline">Dismiss</button>
          </div>
        )}

        {/* View Switcher: Doctors vs Emergency Hospitals */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Doctors & Specialists ({filteredDoctors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'hospitals'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>24x7 Emergency Hospitals ({filteredHospitals.length})</span>
          </button>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by doctor, hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white"
            >
              <option value="all">All Locations (India)</option>
              <option value="Ballari (Bellary)">Ballari (Bellary, Karnataka)</option>
              <option value="Bengaluru (Bangalore)">Bengaluru (Bangalore)</option>
              <option value="Hyderabad">Hyderabad (Telangana)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
            </select>
          </div>

          {/* Specialty Filter (Doctors view) */}
          {activeTab === 'doctors' && (
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white"
              >
                <option value="all">All Medical Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist (Heart)</option>
                <option value="Pediatrician">Pediatrician (Child)</option>
                <option value="Dermatologist">Dermatologist (Skin)</option>
                <option value="ENT">ENT Specialist</option>
                <option value="Orthopedic">Orthopedic Surgeon</option>
                <option value="Pulmonologist">Pulmonologist (Chest)</option>
                <option value="Gynecologist">Gynecologist</option>
              </select>
            </div>
          )}

          {/* 24x7 Checkbox (Hospitals view) */}
          {activeTab === 'hospitals' && (
            <label className="flex items-center gap-2 p-2 border border-slate-300 rounded-lg bg-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-700">24x7 Emergency Only</span>
            </label>
          )}
        </div>
      </div>

      {/* Content Cards */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
          Loading verified healthcare providers...
        </div>
      ) : activeTab === 'doctors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block mt-0.5">
                      {doc.specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium">{doc.hospital}</p>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.qualification} ({doc.experienceYears} yrs experience)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{doc.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.availability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Consultation Fee</span>
                  <span className="font-mono font-bold text-slate-800">₹{doc.consultationFee}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${doc.phone}`}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Clinic</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${doc.hospital} ${doc.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{hosp.name}</h3>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{hosp.type}</span>
                  </div>
                  {hosp.is24x7Emergency && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-bold shrink-0">
                      24x7 Emergency
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hosp.address}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-slate-600">
                    <span>ICU: <strong className="text-teal-700">{hosp.icuAvailable ? 'Available' : 'N/A'}</strong></span>
                    <span>Ambulance: <strong className="text-teal-700">{hosp.ambulanceAvailable ? '24x7 On-Call' : 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Emergency Helpline</span>
                  <span className="font-mono font-bold text-red-600">{hosp.emergencyPhone}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${hosp.emergencyPhone.split('/')[0].trim()}`}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Emergency</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hosp.name} ${hosp.city}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
