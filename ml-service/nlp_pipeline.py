"""
Natural Language Processing (NLP) Pipeline for Symptom Extraction
Performs text normalization, tokenization, stopword removal,
medical entity recognition, duration detection, and severity extraction.
"""

import re
import json
from typing import Dict, List, Any, Optional

# Standardized symptom keyword mapping (supports English, Hindi transliteration, Kannada transliteration, etc.)
SYMPTOM_DICTIONARY = {
    "fever": ["fever", "high temperature", "pyrexia", "feverish", "bukhar", "jwara", "kaichal", "jwaram"],
    "headache": ["headache", "head ache", "migraine", "cephalea", "throbbing head", "sar dard", "tale novu", "thala noppi"],
    "chest_pain": ["chest pain", "angina", "chest tightness", "chest pressure", "chhati me dard", "ede novu", "nenju vali"],
    "shortness_of_breath": ["shortness of breath", "breathlessness", "difficulty breathing", "dyspnea", "gasping", "saans lene me dikkat", "swasa aada kapovadam"],
    "cough": ["cough", "coughing", "khasi", "kemmu", "irumal", "daggu"],
    "fatigue": ["fatigue", "exhaustion", "tiredness", "weakness", "lethargy", "thakan", "kamzori", "ayasa", "nirasam"],
    "chills": ["chills", "shivering", "rigors", "thandi lagna", "chali"],
    "body_ache": ["body ache", "body pain", "muscle pain", "myalgia", "badan dard", "deha novu"],
    "nausea": ["nausea", "queasiness", "feeling sick", "ji michlana"],
    "vomiting": ["vomiting", "throwing up", "puking", "emesis", "ulti", "vanti"],
    "diarrhea": ["diarrhea", "loose stools", "loose motions", "watery stool", "dast", "bedi"],
    "abdominal_pain": ["abdominal pain", "stomach pain", "stomach ache", "belly ache", "cramps", "pet dard", "hotte novu"],
    "loss_of_appetite": ["loss of appetite", "not hungry", "poor appetite", "bhookh na lagna"],
    "sore_throat": ["sore throat", "throat pain", "scratchy throat", "gala kharab", "gontlu novu"],
    "runny_nose": ["runny nose", "stuffy nose", "nasal congestion", "sneezing", "naak behna", "moogu soruvudu"],
    "wheezing": ["wheezing", "whistling breath", "asthma sound"],
    "joint_pain": ["joint pain", "knee pain", "swollen joints", "arthralgia", "jodo ka dard", "keelu novu"],
    "skin_rash": ["skin rash", "red spots", "eruption", "hives", "chakatte", "arippu"],
    "burning_urination": ["burning urination", "painful urine", "dysuria", "peshab me jalan", "moothra uritha"],
    "frequent_urination": ["frequent urination", "peeing often", "excessive thirst", "polyuria", "baar baar peshab"],
    "retro_orbital_pain": ["pain behind eyes", "retro orbital pain", "eye pain with fever", "aankhon ke peeche dard"],
    "sudden_weakness_paralysis": ["sudden weakness", "facial drooping", "paralysis", "arm numbness", "lakwa", "pakshaghata"],
    "slurred_speech": ["slurred speech", "difficulty speaking", "cannot talk", "bolne me dikkat"],
    "loss_of_consciousness": ["fainted", "blackout", "passed out", "syncope", "behoshi", "moorche"],
    "palpitations": ["palpitations", "racing heart", "rapid heartbeat", "irregular pulse", "dil ki dhadkan tezz"]
}

SEVERITY_KEYWORDS = {
    "severe": ["severe", "unbearable", "extreme", "terrible", "intense", "very bad", "excruciating", "bohot zyada", "tivra"],
    "moderate": ["moderate", "medium", "quite bad", "noticeable", "somewhat", "madhyama"],
    "mild": ["mild", "slight", "little bit", "minor", "not too bad", "halka", "swalpa"]
}

DURATION_PATTERNS = [
    r'(\d+)\s*(days?|din|dina|roju|naatkal)',
    r'(\d+)\s*(weeks?|hafte|vara|vaaram)',
    r'(\d+)\s*(months?|mahine|tingalu)',
    r'(\d+)\s*(hours?|ghante|gante)',
    r'(since\s+yesterday|kal\s+se|ninne\s+inda)',
    r'(today|aaj|ivattu)',
    r'(few\s+days|kuch\s+din|kelavu\s+dina)'
]

STOPWORDS = {
    "i", "me", "my", "myself", "we", "our", "ours", "you", "your", "he", "him", "she",
    "her", "it", "its", "they", "them", "what", "which", "who", "whom", "this", "that",
    "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or",
    "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
    "against", "between", "into", "through", "during", "before", "after", "above", "below",
    "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
    "further", "then", "once", "here", "there", "when", "where", "why", "how", "all",
    "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will",
    "just", "don", "should", "now"
}

class SymptomNLPPipeline:
    def __init__(self):
        pass

    def normalize_text(self, text: str) -> str:
        """Step 2: Normalize user input text."""
        text = text.lower().strip()
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text

    def tokenize_and_filter(self, normalized_text: str) -> List[str]:
        """Step 3 & 4: Tokenize and remove stopwords."""
        tokens = normalized_text.split()
        return [t for t in tokens if t not in STOPWORDS]

    def extract_duration(self, raw_text: str) -> Optional[str]:
        """Step 8: Detect duration."""
        lower = raw_text.lower()
        for pattern in DURATION_PATTERNS:
            match = re.search(pattern, lower)
            if match:
                return match.group(0).strip()
        return None

    def extract_overall_severity(self, raw_text: str) -> str:
        """Step 9: Detect overall severity."""
        lower = raw_text.lower()
        for sev, words in SEVERITY_KEYWORDS.items():
            for w in words:
                if re.search(r'\b' + re.escape(w) + r'\b', lower):
                    return sev
        return "unknown"

    def detect_symptoms(self, text: str) -> List[Dict[str, Any]]:
        """Steps 5, 6, 7: Medical keyword match, entity recognition & mapping."""
        clean_text = text.lower()
        extracted: List[Dict[str, Any]] = []
        found_ids = set()

        for symptom_id, phrases in SYMPTOM_DICTIONARY.items():
            for phrase in phrases:
                pattern = r'\b' + re.escape(phrase) + r'\b'
                match = re.search(pattern, clean_text)
                if match and symptom_id not in found_ids:
                    found_ids.add(symptom_id)
                    # Check localized severity near this symptom
                    start_idx = max(0, match.start() - 30)
                    end_idx = min(len(clean_text), match.end() + 30)
                    window = clean_text[start_idx:end_idx]
                    
                    local_sev = "unknown"
                    for sev, words in SEVERITY_KEYWORDS.items():
                        if any(w in window for w in words):
                            local_sev = sev
                            break

                    extracted.append({
                        "name": symptom_id,
                        "display_name": phrase.title(),
                        "severity": local_sev
                    })
                    break

        return extracted

    def process(self, raw_user_text: str) -> Dict[str, Any]:
        """Full pipeline execution returning structured JSON."""
        normalized = self.normalize_text(raw_user_text)
        filtered_tokens = self.tokenize_and_filter(normalized)
        symptoms = self.detect_symptoms(raw_user_text)
        duration = self.extract_duration(raw_user_text)
        overall_severity = self.extract_overall_severity(raw_user_text)

        # Update symptom severity with overall severity if still unknown
        if overall_severity != "unknown":
            for s in symptoms:
                if s["severity"] == "unknown":
                    s["severity"] = overall_severity

        return {
            "symptoms": symptoms,
            "duration": duration or "Unspecified",
            "overall_severity": overall_severity,
            "normalized_text": normalized,
            "tokens_count": len(filtered_tokens)
        }

if __name__ == "__main__":
    pipeline = SymptomNLPPipeline()
    sample_input = "I have been having severe headache and fever for two days."
    output = pipeline.process(sample_input)
    print("NLP Pipeline Output Test:")
    print(json.dumps(output, indent=2))
