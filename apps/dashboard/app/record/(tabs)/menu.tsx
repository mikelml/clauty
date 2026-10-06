import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useMockPersona } from '@/mock/MockContext';
import { useIntegrations } from '@/hooks/useIntegrations';
import { type Integration } from '@/mock/integrations';
import { IntegrationLogo } from '@/components/IntegrationLogo';

const statusColor: Record<Integration['status'], string> = {
  live: '#34C759',
  syncing: '#FF9500',
  idle: 'rgba(255,255,255,0.3)',
};

const statusLabel: Record<Integration['status'], string> = {
  live: 'Conectado',
  syncing: 'Sincronizando',
  idle: 'En espera',
};

export default function RecordMenuTab() {
  const persona = useMockPersona();
  const { integrations, source, loading } = useIntegrations();

  if (!persona) return null;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integraciones</Text>
          <Text style={styles.sectionSub}>
            Servicios que la colonia de {persona.name.split(' ')[0]} est\u00E1 leyendo.
          </Text>
          {source === 'mock' && !loading && (
            <Text style={styles.sourceHint}>modo offline</Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="rgba(255,255,255,0.4)" />
          </View>
        ) : (
          integrations.map((i) => (
            <View key={i.id} style={styles.row}>
              <IntegrationLogo id={i.id} size={38} radius={10} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{i.label}</Text>
                <View style={styles.statusLine}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor[i.status] }]} />
                  <Text style={styles.statusText}>{statusLabel[i.status]}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>ClauTY demo \u00B7 {persona.months} meses activo</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0F2E' },
  scroll: { paddingVertical: 16, paddingHorizontal: 20 },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 6,
  },
  sourceHint: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 10,
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  rowText: { flex: 1 },
  rowLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    letterSpacing: 1,
  },
});
