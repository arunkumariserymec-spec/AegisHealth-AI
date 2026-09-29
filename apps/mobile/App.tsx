import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, StatusBar } from 'react-native';

// Bottom Navigation items for Mobile App
type TabType = 'home' | 'checker' | 'history' | 'doctors' | 'profile';

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn' | 'ta' | 'te'>('en');

  const emergencyAlert = () => {
    Alert.alert(
      'Emergency Alert',
      'For severe symptoms like chest pain, severe breathlessness or paralysis, immediately call 108 / 112.',
      [{ text: 'Call 108', onPress: () => console.log('Dialing 108') }, { text: 'Dismiss', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>AI Health</Text>
          <Text style={styles.brandSubtitle}>Symptom Checker</Text>
        </View>
        <TouchableOpacity style={styles.emergencyBtn} onPress={emergencyAlert}>
          <Text style={styles.emergencyBtnText}>SOS 108</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'home' && (
          <View style={styles.homeContainer}>
            <View style={styles.heroCard}>
              <Text style={styles.heroKicker}>Triage & Clinical Guidance</Text>
              <Text style={styles.heroTitle}>How are you feeling today?</Text>
              <Text style={styles.heroBody}>
                Report your symptoms in natural language for preliminary AI guidance and triage evaluation.
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('checker')}>
                <Text style={styles.primaryBtnText}>Start Symptom Check</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                ⚠️ Disclaimer: Not a substitute for a qualified doctor. No definitive diagnosis is provided.
              </Text>
            </View>

            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('doctors')}>
                <Text style={styles.actionCardTitle}>Find Doctors</Text>
                <Text style={styles.actionCardDesc}>Nearby clinics and hospitals in India</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('history')}>
                <Text style={styles.actionCardTitle}>Past Consultations</Text>
                <Text style={styles.actionCardDesc}>Review previous triage reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'checker' && (
          <View style={styles.checkerContainer}>
            <Text style={styles.sectionTitle}>Symptom Assessment</Text>
            <Text style={styles.helperText}>Describe your symptoms, how long you've had them, and severity:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="e.g. I have had a high fever and severe headache for 2 days..."
              value={symptomsInput}
              onChangeText={setSymptomsInput}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Assessment Submitted', 'Analyzing via Random Forest ML Service...')}>
              <Text style={styles.primaryBtnText}>Analyze with AI</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'doctors' && (
          <View style={styles.screenContainer}>
            <Text style={styles.sectionTitle}>Doctors & Emergency Care</Text>
            <View style={styles.doctorCard}>
              <Text style={styles.doctorName}>VIMS Hospital Ballari</Text>
              <Text style={styles.doctorSpecialty}>24x7 Emergency / Internal Medicine</Text>
              <Text style={styles.doctorAddress}>Cantonment Road, Ballari, Karnataka</Text>
              <Text style={styles.doctorPhone}>Emergency: 108 / +91 8392 235201</Text>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.screenContainer}>
            <Text style={styles.sectionTitle}>Consultation History</Text>
            <Text style={styles.emptyText}>No past consultations yet on this device.</Text>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.screenContainer}>
            <Text style={styles.sectionTitle}>User Profile & Language</Text>
            <Text style={styles.profileText}>Status: Guest Mode</Text>
            <Text style={styles.profileText}>Language: {language.toUpperCase()}</Text>
          </View>
        )}
      </ScrollView>

      {/* Main Bottom Navigation: Home | Check Symptoms | History | Doctors | Profile */}
      <View style={styles.bottomNav}>
        {(['home', 'checker', 'history', 'doctors', 'profile'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, activeTab === tab && styles.navItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.navText, activeTab === tab && styles.navTextActive]}>
              {tab === 'checker' ? 'Check' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  brandTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  brandSubtitle: { fontSize: 11, color: '#0D9488', fontWeight: '600' },
  emergencyBtn: { backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  emergencyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  homeContainer: { gap: 16 },
  heroCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  heroKicker: { fontSize: 12, color: '#0D9488', fontWeight: '600', marginBottom: 4 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  heroBody: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  primaryBtn: { backgroundColor: '#0D9488', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  disclaimerBox: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A' },
  disclaimerText: { fontSize: 12, color: '#92400E', lineHeight: 16 },
  actionGrid: { gap: 12 },
  actionCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  actionCardTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  actionCardDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  checkerContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  helperText: { fontSize: 13, color: '#64748B' },
  textInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 12, fontSize: 14, minHeight: 90, textAlignVertical: 'top' },
  screenContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  doctorCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', gap: 4 },
  doctorName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  doctorSpecialty: { fontSize: 13, color: '#0D9488', fontWeight: '600' },
  doctorAddress: { fontSize: 12, color: '#64748B' },
  doctorPhone: { fontSize: 12, color: '#DC2626', fontWeight: '600' },
  emptyText: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic' },
  profileText: { fontSize: 14, color: '#334155' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, flex: 1 },
  navItemActive: { borderTopWidth: 2, borderColor: '#0D9488' },
  navText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  navTextActive: { color: '#0D9488', fontWeight: '700' }
});
