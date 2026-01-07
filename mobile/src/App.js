import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'error', message: 'API unreachable' }));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>MTLVibes — Mobile</Text>
      <Text style={{ marginTop: 8 }}>API: {API_BASE}</Text>
      <View style={{ marginTop: 16, padding: 12, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontWeight: '600' }}>Health</Text>
        <Text style={{ marginTop: 6 }}>{health ? JSON.stringify(health) : 'Loading...'}</Text>
      </View>
    </SafeAreaView>
  );
}
