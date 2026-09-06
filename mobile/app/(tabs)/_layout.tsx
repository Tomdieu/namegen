import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useFavorites } from '../../src/store/favorites';
import { usePreferences } from '../../src/store/preferences';
import { brand } from '../../src/theme';

export default function TabsLayout() {
  const { colors, t } = usePreferences();
  const { favorites } = useFavorites();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      iconColor={{ default: colors.subtext, selected: "#fff" }}
      tintColor={brand.pink}
      indicatorColor={brand.pink}
      badgeBackgroundColor={brand.pink}
      labelStyle={{ fontWeight: '900' }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="sparkles" md="casino" />
        <NativeTabs.Trigger.Label>{t('tabGenerate')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'star', selected: 'star.fill' }}
          md={{ default: 'star_outline', selected: 'star' }}
        />
        <NativeTabs.Trigger.Label>{t('tabSaved')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Badge hidden={favorites.length === 0}>
          {String(favorites.length)}
        </NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'info.circle', selected: 'info.circle.fill' }}
          md={{ default: 'info', selected: 'info' }}
        />
        <NativeTabs.Trigger.Label>{t('tabAbout')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
