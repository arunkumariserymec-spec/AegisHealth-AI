/**
 * Multilingual Translations and Controlled Medical Terminology
 * Supports English, Hindi, Kannada, Tamil, Telugu
 */

import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  howAreYouFeeling: string;
  startCheck: string;
  chatWithAi: string;
  findDoctors: string;
  findHospitals: string;
  history: string;
  home: string;
  profile: string;
  admin: string;
  settings: string;
  disclaimerNotice: string;
  disclaimerFull: string;
  emergencyAlertTitle: string;
  emergencyAlertBody: string;
  callAmbulance: string;
  symptomsLabel: string;
  severityLabel: string;
  durationLabel: string;
  possibleConditions: string;
  generalPrecautions: string;
  whenToSeekCare: string;
  saveConsultation: string;
  startNewCheck: string;
  languageSelect: string;
  guestUser: string;
  guestModeNotice: string;
  login: string;
  register: string;
  logout: string;
  medicalSpecialties: {
    generalPhysician: string;
    cardiologist: string;
    pediatrician: string;
    dermatologist: string;
    ent: string;
    orthopedic: string;
    gynecologist: string;
    pulmonologist: string;
  };
  triageLevels: {
    emergency: string;
    urgent: string;
    moderate: string;
    self_care: string;
  };
}

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' }
];

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'AegisHealth AI',
    tagline: 'Smart Care. Better Lives.',
    howAreYouFeeling: 'How are you feeling today?',
    startCheck: 'Start Symptom Assessment',
    chatWithAi: 'Chat with Health AI',
    findDoctors: 'Find Doctors & Hospitals',
    findHospitals: 'Emergency Hospitals Nearby',
    history: 'Consultation History',
    home: 'Home',
    profile: 'Profile',
    admin: 'Admin & ML Metrics',
    settings: 'Settings',
    disclaimerNotice: 'Not a medical diagnosis. For preliminary guidance only.',
    disclaimerFull: 'Important Medical Disclaimer: This application provides preliminary health information based on statistical machine learning models and NLP analysis. It is NOT a substitute for professional clinical advice, examination, or diagnosis. Always seek the advice of a qualified physician with any questions regarding medical conditions. In an emergency, immediately call local emergency services (112 / 108 in India).',
    emergencyAlertTitle: 'Emergency Medical Alert',
    emergencyAlertBody: 'Your reported symptoms indicate a potentially serious medical condition requiring immediate emergency evaluation.',
    callAmbulance: 'Call Emergency Ambulance (108 / 112)',
    symptomsLabel: 'Reported Symptoms',
    severityLabel: 'Severity',
    durationLabel: 'Duration',
    possibleConditions: 'Possible Conditions (Statistical Guidance)',
    generalPrecautions: 'Recommended Self-Care & Precautions',
    whenToSeekCare: 'When to Seek Immediate Medical Evaluation',
    saveConsultation: 'Save to Consultation History',
    startNewCheck: 'Start New Assessment',
    languageSelect: 'Select Language',
    guestUser: 'Guest User',
    guestModeNotice: 'Using Guest mode. You can assess symptoms freely without saving a permanent profile.',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    medicalSpecialties: {
      generalPhysician: 'General Physician / Internal Medicine',
      cardiologist: 'Cardiologist (Heart Specialist)',
      pediatrician: 'Pediatrician (Child Specialist)',
      dermatologist: 'Dermatologist (Skin Specialist)',
      ent: 'ENT Specialist (Ear, Nose, Throat)',
      orthopedic: 'Orthopedic Surgeon (Bones & Joints)',
      gynecologist: 'Gynecologist (Women’s Health)',
      pulmonologist: 'Pulmonologist (Chest & Lungs)'
    },
    triageLevels: {
      emergency: 'Critical Emergency - Seek Immediate Care',
      urgent: 'Urgent Care Required Within 24 Hours',
      moderate: 'Moderate - Consult a Physician Soon',
      self_care: 'Mild / General Self-Care Guidance'
    }
  },
  hi: {
    appName: 'एआई स्वास्थ्य लक्षण परीक्षक',
    tagline: 'प्राथमिक स्वास्थ्य मार्गदर्शन एवं ट्राइएज प्रणाली',
    howAreYouFeeling: 'आज आप कैसा महसूस कर रहे हैं?',
    startCheck: 'लक्षण मूल्यांकन शुरू करें',
    chatWithAi: 'स्वास्थ्य एआई से चैट करें',
    findDoctors: 'डॉक्टर और अस्पताल खोजें',
    findHospitals: 'निकटतम आपातकालीन अस्पताल',
    history: 'परामर्श इतिहास',
    home: 'होम',
    profile: 'प्रोफाइल',
    admin: 'व्यवस्थापक एवं एमएल मेट्रिक्स',
    settings: 'सेटिंग्स',
    disclaimerNotice: 'यह कोई चिकित्सकीय निदान नहीं है। केवल प्राथमिक मार्गदर्शन हेतु।',
    disclaimerFull: 'महत्वपूर्ण चिकित्सकीय अस्वीकरण: यह एप्लिकेशन केवल प्राथमिक स्वास्थ्य मार्गदर्शन प्रदान करता है और योग्य चिकित्सक के निदान का विकल्प नहीं है। गंभीर स्थिति में तुरंत आपातकालीन सेवा 108 / 112 पर संपर्क करें।',
    emergencyAlertTitle: 'आपातकालीन चेतावनी',
    emergencyAlertBody: 'आपके लक्षणों से संभावित गंभीर स्थिति का संकेत मिलता है। कृपया तुरंत नजदीकी अस्पताल या आपातकालीन सेवा से संपर्क करें।',
    callAmbulance: 'एम्बुलेंस बुलाएं (108 / 112)',
    symptomsLabel: 'बताए गए लक्षण',
    severityLabel: 'गंभीरता',
    durationLabel: 'अवधि',
    possibleConditions: 'संभावित स्वास्थ्य स्थितियां (सांख्यिकीय अनुमान)',
    generalPrecautions: 'सामान्य सावधानियां एवं देखभाल',
    whenToSeekCare: 'डॉक्टर से कब तत्काल संपर्क करें',
    saveConsultation: 'इतिहास में सहेजें',
    startNewCheck: 'नया मूल्यांकन शुरू करें',
    languageSelect: 'भाषा चुनें',
    guestUser: 'अतिथि उपयोगकर्ता',
    guestModeNotice: 'अतिथि मोड सक्रिय है। आप बिना खाते के लक्षण जांच सकते हैं।',
    login: 'लॉग इन',
    register: 'साइन अप',
    logout: 'लॉग आउट',
    medicalSpecialties: {
      generalPhysician: 'सामान्य चिकित्सक (जनरल फिजिशियन)',
      cardiologist: 'हृदय रोग विशेषज्ञ (कार्डियोलॉजिस्ट)',
      pediatrician: 'शिशु रोग विशेषज्ञ (पीडियाट्रिशियन)',
      dermatologist: 'त्वचा रोग विशेषज्ञ (डर्मेटोलॉजिस्ट)',
      ent: 'कान, नाक और गला विशेषज्ञ (ईएनटी)',
      orthopedic: 'हड्डी रोग विशेषज्ञ (ऑर्थोपेडिक)',
      gynecologist: 'स्त्री रोग विशेषज्ञ (गाइनेकोलॉजिस्ट)',
      pulmonologist: 'फेफड़ा रोग विशेषज्ञ (पल्मोनोलॉजिस्ट)'
    },
    triageLevels: {
      emergency: 'गंभीर आपातकाल - तुरंत अस्पताल जाएं',
      urgent: 'जरूरी - 24 घंटे में डॉक्टर को दिखाएं',
      moderate: 'मध्यम - चिकित्सक से परामर्श लें',
      self_care: 'सामान्य - घर पर प्राथमिक देखभाल'
    }
  },
  kn: {
    appName: 'ಎಐ ಆರೋಗ್ಯ ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ',
    tagline: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಟ್ರಯೇಜ್ ವ್ಯವಸ್ಥೆ',
    howAreYouFeeling: 'ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯ ಹೇಗಿದೆ?',
    startCheck: 'ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷೆ ಆರಂಭಿಸಿ',
    chatWithAi: 'ಆರೋಗ್ಯ ಎಐ ಜೊತೆ ಚಾಟ್ ಮಾಡಿ',
    findDoctors: 'ವೈದ್ಯರು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    findHospitals: 'ಹತ್ತಿರದ ತುರ್ತು ಆಸ್ಪತ್ರೆಗಳು',
    history: 'ಸಮಾಲೋಚನೆ ಇತಿಹಾಸ',
    home: 'ಮುಖಪುಟ',
    profile: 'ಪ್ರೊಫೈಲ್',
    admin: 'ನಿರ್ವಾಹಕ ಮತ್ತು ಎಂಎಲ್ ಅಂಕಿಅಂಶ',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    disclaimerNotice: 'ಇದು ಅಧಿಕೃತ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ಕೇವಲ ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.',
    disclaimerFull: 'ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಹಕ್ಕುತ್ಯಾಗ: ಈ ತಂತ್ರಾಂಶವು ಕೇವಲ ಪ್ರಾಥಮಿಕ ಮಾಹಿತಿಯನ್ನು ನೀಡುತ್ತದೆ. ಯಾವುದೇ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ತುರ್ತು ಸಂಖ್ಯೆ 108 / 112 ಗೆ ಕರೆ ಮಾಡಿ.',
    emergencyAlertTitle: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಎಚ್ಚರಿಕೆ',
    emergencyAlertBody: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ಗಂಭೀರ ವೈದ್ಯಕೀಯ ಸ್ಥಿತಿಯನ್ನು ಸೂಚಿಸುತ್ತಿವೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    callAmbulance: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ (108 / 112)',
    symptomsLabel: 'ದಾಖಲಿಸಿದ ಲಕ್ಷಣಗಳು',
    severityLabel: 'ತೀವ್ರತೆ',
    durationLabel: 'ಅವಧಿ',
    possibleConditions: 'ಸಂಭಾವ್ಯ ಆರೋಗ್ಯ ಪರಿಸ್ಥಿತಿಗಳು (ಅಂದಾಜು)',
    generalPrecautions: 'ಸಾಮಾನ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸ್ವ-ಆರೈಕೆ',
    whenToSeekCare: 'ವೈದ್ಯರನ್ನು ಯಾವಾಗ ತುರ್ತಾಗಿ ಕಾಣಬೇಕು',
    saveConsultation: 'ಇತಿಹಾಸದಲ್ಲಿ ಉಳಿಸಿ',
    startNewCheck: 'ಹೊಸ ತಪಾಸಣೆ ಆರಂಭಿಸಿ',
    languageSelect: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    guestUser: 'ಅತಿಥಿ ಬಳಕೆದಾರ',
    guestModeNotice: 'ಅತಿಥಿ ವಿಧಾನ ಸಕ್ರಿಯವಾಗಿದೆ. ನೀವು ಖಾತೆ ಇಲ್ಲದೆ ತಪಾಸಣೆ ಮಾಡಬಹುದು.',
    login: 'ಲಾಗಿನ್',
    register: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗ್ ಔಟ್',
    medicalSpecialties: {
      generalPhysician: 'ಸಾಮಾನ್ಯ ವೈದ್ಯರು (ಜನರಲ್ ಫಿಸಿಷಿಯನ್)',
      cardiologist: 'ಹೃದ್ರೋಗ ತಜ್ಞರು (ಕಾರ್ಡಿಯಾಲಜಿಸ್ಟ್)',
      pediatrician: 'ಮಕ್ಕಳ ತಜ್ಞರು (ಪೀಡಿಯಾಟ್ರಿಶಿಯನ್)',
      dermatologist: 'ಚರ್ಮರೋಗ ತಜ್ಞರು (ಡರ್ಮಟಾಲಜಿಸ್ಟ್)',
      ent: 'ಕಿವಿ, ಮೂಗು ಮತ್ತು ಗಂಟಲು ತಜ್ಞರು (ಇಎನ್‌ಟಿ)',
      orthopedic: 'ಮೂಳೆ ತಜ್ಞರು (ಆರ್ಥೋಪೆಡಿಕ್)',
      gynecologist: 'ಸ್ತ್ರೀರೋಗ ತಜ್ಞರು (ಗೈನೆಕಾಲಜಿಸ್ಟ್)',
      pulmonologist: 'ಶ್ವಾಸಕೋಶ ತಜ್ಞರು (ಪಲ್ಮನಾಲಜಿಸ್ಟ್)'
    },
    triageLevels: {
      emergency: 'ಗಂಭೀರ ತುರ್ತು - ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ',
      urgent: 'ತುರ್ತು - 24 ಗಂಟೆಗಳಲ್ಲಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',
      moderate: 'ಮಧ್ಯಮ - ವೈದ್ಯಕೀಯ ಸಲಹೆ ಪಡೆಯಿರಿ',
      self_care: 'ಸೌಮ್ಯ - ಮನೆಯಲ್ಲಿ ಪ್ರಾಥಮಿಕ ಆರೈಕೆ'
    }
  },
  ta: {
    appName: 'ஏஐ சுகாதார அறிகுறி சரிபார்ப்பு',
    tagline: 'ஆரம்ப சுகாதார வழிகாட்டுதல் மற்றும் ட்ரையேஜ் அமைப்பு',
    howAreYouFeeling: 'இன்று உங்கள் உடல்நலம் எப்படி உள்ளது?',
    startCheck: 'அறிகுறி மதிப்பீட்டைத் தொடங்கு',
    chatWithAi: 'சுகாதார ஏஐ உடன் உரையாடுங்கள்',
    findDoctors: 'மருத்துவர்கள் & மருத்துவமனைகள்',
    findHospitals: 'அருகிலுள்ள அவசர மருத்துவமனைகள்',
    history: 'ஆலோசனை வரலாறு',
    home: 'முகப்பு',
    profile: 'சுயவிவரம்',
    admin: 'நிர்வாகி & இயந்திர கற்றல் புள்ளிவிவரம்',
    settings: 'அமைப்புகள்',
    disclaimerNotice: 'இது மருத்துவ நோயறிதல் அல்ல. ஆரம்ப வழிகாட்டுதலுக்கு மட்டுமே.',
    disclaimerFull: 'முக்கிய மருத்துவ எச்சரிக்கை: இந்த பயன்பாடு கணினி மாதிரி அடிப்படையிலான ஆரம்ப சுகாதார தகவல்களை மட்டுமே வழங்குகிறது. மருத்துவ அவசரநிலையில் உடனடியாக 108 / 112 அவசர எண்ணை அழைக்கவும்.',
    emergencyAlertTitle: 'அவசர மருத்துவ எச்சரிக்கை',
    emergencyAlertBody: 'உங்கள் அறிகுறிகள் உடனடி மருத்துவ கவனிப்பு தேவைப்படும் தீவிர நிலையைக் குறிக்கின்றன.',
    callAmbulance: 'ஆம்புலன்ஸ் அழைக்கவும் (108 / 112)',
    symptomsLabel: 'தெரிவிக்கப்பட்ட அறிகுறிகள்',
    severityLabel: 'தீவிரம்',
    durationLabel: 'கால அளவு',
    possibleConditions: 'சாத்தியமான உடல்நலக் குறைபாடுகள்',
    generalPrecautions: 'பொதுவான முன்னெச்சரிக்கைகள்',
    whenToSeekCare: 'எப்போது உடனடியாக மருத்துவரை அணுக வேண்டும்',
    saveConsultation: 'வரலாற்றில் சேமிக்கவும்',
    startNewCheck: 'புதிய மதிப்பீட்டைத் தொடங்கு',
    languageSelect: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    guestUser: 'விருந்தினர் பயனர்',
    guestModeNotice: 'விருந்தினர் பயன்முறை செயலில் உள்ளது. நீங்கள் கணக்கு இல்லாமல் அறிகுறிகளை சோதிக்கலாம்.',
    login: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    medicalSpecialties: {
      generalPhysician: 'பொது மருத்துவர் (General Physician)',
      cardiologist: 'இதய நோய் நிபுணர் (Cardiologist)',
      pediatrician: 'குழந்தை நல மருத்துவர் (Pediatrician)',
      dermatologist: 'தோல் நோய் நிபுணர் (Dermatologist)',
      ent: 'காது, மூக்கு, தொண்டை நிபுணர் (ENT)',
      orthopedic: 'எலும்பு மூட்டு நிபுணர் (Orthopedic)',
      gynecologist: 'மகளிர் நலம் மற்றும் மகப்பேறு நிபுணர் (Gynecologist)',
      pulmonologist: 'நுரையீரல் சிகிச்சை நிபுணர் (Pulmonologist)'
    },
    triageLevels: {
      emergency: 'அவசர சிகிச்சை தேவை - உடனே மருத்துவமனை செல்லவும்',
      urgent: 'முக்கியம் - 24 மணி நேரத்திற்குள் மருத்துவரை அணுகவும்',
      moderate: 'மிதமானது - மருத்துவ ஆலோசனை பெறவும்',
      self_care: 'லேசானது - பொதுவான சுய பராமரிப்பு'
    }
  },
  te: {
    appName: 'AI హెల్త్ సింప్టమ్ చెకర్',
    tagline: 'ప్రాథమిక ఆరోగ్య మార్గదర్శకత్వం మరియు ట్రియాజ్ సిస్టమ్',
    howAreYouFeeling: 'ఈరోజు మీ ఆరోగ్యం ఎలా ఉంది?',
    startCheck: 'లక్షణాల అంచనా ప్రారంభించండి',
    chatWithAi: 'హెల్త్ AI తో చాట్ చేయండి',
    findDoctors: 'వైద్యులు & ఆసుపత్రులను కనుగొనండి',
    findHospitals: 'సమీప అత్యవసర ఆసుపత్రులు',
    history: 'సలహాల చరిత్ర',
    home: 'హోమ్',
    profile: 'ప్రొఫైల్',
    admin: 'అడ్మిన్ & ML గణాంకాలు',
    settings: 'సెట్టింగ్‌లు',
    disclaimerNotice: 'ఇది వైద్య నిర్ధారణ కాదు. ప్రాథమిక మార్గదర్శకత్వం కోసం మాత్రమే.',
    disclaimerFull: 'ముఖ్యమైన వైద్య నిరాకరణ: ఈ అప్లికేషన్ ప్రాథమిక సమాచారాన్ని మాత్రమే అందిస్తుంది. అత్యవసర పరిస్థితుల్లో వెంటనే సమీప ఆసుపత్రికి వెళ్లండి లేదా 108 / 112 కు కాల్ చేయండి.',
    emergencyAlertTitle: 'అత్యవసర వైద్య హెచ్చరిక',
    emergencyAlertBody: 'మీ లక్షణాలు తక్షణ వైద్య సహాయం అవసరమైన తీవ్రమైన పరిస్థితిని సూచిస్తున్నాయి.',
    callAmbulance: 'అంబులెన్స్ కాల్ చేయండి (108 / 112)',
    symptomsLabel: 'తెలిపిన లక్షణాలు',
    severityLabel: 'తీవ్రత',
    durationLabel: 'వ్యవధి',
    possibleConditions: 'సాధ్యమైన ఆరోగ్య పరిస్థితులు (అంచనా)',
    generalPrecautions: 'సాధారణ జాగ్రత్తలు మరియు స్వీయ రక్షణ',
    whenToSeekCare: 'వైద్యుడిని ఎప్పుడు వెంటనే సంప్రదించాలి',
    saveConsultation: 'చరిత్రలో సేవ్ చేయండి',
    startNewCheck: 'కొత్త అంచనాను ప్రారంభించండి',
    languageSelect: 'భాషను ఎంచుకోండి',
    guestUser: 'గెస్ట్ యూజర్',
    guestModeNotice: 'గెస్ట్ మోడ్ యాక్టివ్‌గా ఉంది. మీరు ఖాతా లేకుండా లక్షణాలను తనిఖీ చేయవచ్చు.',
    login: 'లాగిన్',
    register: 'సైన్ అప్',
    logout: 'లాగ్ అవుట్',
    medicalSpecialties: {
      generalPhysician: 'జనరల్ ఫిజీషియన్ (సాధారణ వైద్యుడు)',
      cardiologist: 'కార్డియాలజిస్ట్ (గుండె నిపుణుడు)',
      pediatrician: 'పీడియాట్రిషియన్ (పిల్లల వైద్యుడు)',
      dermatologist: 'డెర్మటాలజిస్ట్ (చర్మవ్యాధి నిపుణుడు)',
      ent: 'ఈఎన్‌టీ స్పెషలిస్ట్ (చెవి, ముక్కు, గొంతు)',
      orthopedic: 'ఆర్థోపెడిక్ (ఎముకల నిపుణుడు)',
      gynecologist: 'గైనకాలజిస్ట్ (స్త్రీల వైద్యురాలు)',
      pulmonologist: 'పల్మోనాలజిస్ట్ (ఊపిరితిత్తుల నిపుణుడు)'
    },
    triageLevels: {
      emergency: 'తీవ్రమైన ఎమర్జెన్సీ - వెంటనే ఆసుపత్రికి వెళ్ళండి',
      urgent: 'అత్యవసరం - 24 గంటల్లో వైద్యుడిని సంప్రదించండి',
      moderate: 'మధ్యస్థం - వైద్య సలహా తీసుకోండి',
      self_care: 'స్వల్పం - ఇంట్లోనే ప్రాథమిక సంరక్షణ'
    }
  }
};
