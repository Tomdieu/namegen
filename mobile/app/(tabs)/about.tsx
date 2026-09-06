import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePreferences } from '../../src/store/preferences';
import { hapticLight, hapticSelect } from '../../src/utils/haptics';
import { brand, type Palette, type Locale, type ThemeMode } from '../../src/theme';

export default function AboutScreen() {
  const router = useRouter();
  const { colors, theme, setTheme, locale, setLocale, t } = usePreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const openURL = (url: string) => {
    hapticLight();
    void Linking.openURL(url);
  };

  const pickLocale = (next: Locale) => {
    hapticSelect();
    setLocale(next);
  };

  const pickTheme = (next: ThemeMode) => {
    hapticSelect();
    setTheme(next);
  };

  const stats = [
    { label: t('secLanguage'), value: locale.toUpperCase() },
    { label: t('secTheme'), value: theme === 'light' ? t('themeLight') : t('themeDark') },
    { label: 'Mode', value: 'Playful' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>26ⁿ</Text>
            </View>
            <View style={styles.versionPill}>
              <Text style={styles.versionPillText}>v1.0</Text>
            </View>
          </View>

          <Text style={styles.appTitle}>NameGen</Text>
          <Text style={styles.appTag}>{t('aboutTag')}</Text>
          <Text style={styles.appBody}>{t('aboutBody')}</Text>

          <View style={styles.statsRow}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('secLanguage')}</Text>
          <View style={styles.chipRow}>
            {(
              [
                { id: 'en', label: 'English' },
                { id: 'fr', label: 'Français' },
              ] as { id: Locale; label: string }[]
            ).map((opt) => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.9}
                style={[styles.optionChip, locale === opt.id && styles.optionChipActive]}
                onPress={() => pickLocale(opt.id)}
              >
                <Text
                  style={[styles.optionChipText, locale === opt.id && styles.optionChipTextActive]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.cardTitle, styles.sectionDivider]}>{t('secTheme')}</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.optionChip, theme === 'light' && styles.optionChipActive]}
              onPress={() => pickTheme('light')}
            >
              <Text
                style={[styles.optionChipText, theme === 'light' && styles.optionChipTextActive]}
              >
                {t('themeLight')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.optionChip, theme === 'dark' && styles.optionChipActive]}
              onPress={() => pickTheme('dark')}
            >
              <Text
                style={[styles.optionChipText, theme === 'dark' && styles.optionChipTextActive]}
              >
                {t('themeDark')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('createdBy')} Tomdieu Ivan</Text>

          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.linkBtn, styles.primaryBtn]}
            onPress={() => openURL('https://ivantomdieu.vercel.app/en')}
          >
            <Text style={styles.linkBtnText}>{t('visitSite')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.linkBtn, styles.secondaryBtn]}
            onPress={() => openURL('https://github.com/Tomdieu/namegen')}
          >
            <Text style={[styles.linkBtnText, styles.secondaryBtnText]}>{t('starGithub')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.linkBtn, styles.accentBtn]}
            onPress={() => {
              hapticLight();
              router.push({ pathname: '/math', params: { length: '9' } });
            }}
          >
            <Text style={styles.linkBtnText}>{t('aboutMath')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.version}>{t('versionLabel')}</Text>
          <Text style={styles.footerNote}>crafted for naming ideas</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 34,
      gap: 16,
    },
    heroCard: {
      position: 'relative',
      backgroundColor: c.surface,
      borderRadius: 28,
      borderWidth: 1.5,
      borderColor: c.divider,
      padding: 20,
      overflow: 'hidden',
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    heroGlow: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: brand.yellow,
      opacity: 0.22,
    },
    heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    logoBadge: {
      width: 66,
      height: 66,
      borderRadius: 18,
      backgroundColor: brand.ink,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: brand.yellow,
    },
    logoText: {
      color: brand.yellow,
      fontSize: 24,
      fontWeight: '900',
    },
    versionPill: {
      backgroundColor: c.surfaceAlt,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: c.divider,
    },
    versionPillText: {
      color: c.text,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    appTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: c.text,
      letterSpacing: -0.8,
    },
    appTag: {
      fontSize: 12,
      fontWeight: '800',
      color: brand.pink,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginTop: 8,
    },
    appBody: {
      fontSize: 13,
      lineHeight: 20,
      color: c.subtext,
      marginTop: 10,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 18,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.surfaceAlt,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: c.divider,
    },
    statLabel: {
      color: c.subtext,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    statValue: {
      color: c.text,
      fontSize: 12,
      fontWeight: '800',
      marginTop: 5,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: c.divider,
      padding: 18,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: '900',
      color: c.text,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    sectionDivider: {
      marginTop: 16,
    },
    chipRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
      flexWrap: 'wrap',
    },
    optionChip: {
      flex: 1,
      minWidth: 120,
      paddingVertical: 11,
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.divider,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionChipActive: {
      backgroundColor: brand.yellow,
      borderColor: brand.ink,
      shadowColor: brand.ink,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 0,
      elevation: 2,
    },
    optionChipText: {
      fontSize: 12,
      fontWeight: '900',
      color: c.text,
    },
    optionChipTextActive: {
      color: '#1A1A1A',
    },
    linkBtn: {
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#1A1A1A',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    primaryBtn: {
      backgroundColor: brand.yellow,
    },
    secondaryBtn: {
      backgroundColor: '#1A1A1A',
    },
    secondaryBtnText: {
      color: brand.yellow,
    },
    accentBtn: {
      backgroundColor: brand.blue,
    },
    linkBtnText: {
      fontSize: 13,
      fontWeight: '900',
      color: '#1A1A1A',
    },
    footerRow: {
      alignItems: 'center',
      gap: 6,
      paddingTop: 4,
    },
    version: {
      fontSize: 11,
      fontWeight: '700',
      color: c.subtext,
      textAlign: 'center',
    },
    footerNote: {
      color: c.subtext,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
  });
