import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface StatusBarScrimProps {
  /**
   * Color base del degradado. Por defecto el tono crema cálido de RutiGo '#FFFCF8'.
   */
  baseColor?: string;
}

export function StatusBarScrim({ baseColor = '#FFFCF8' }: StatusBarScrimProps) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, 24);
  const scrimHeight = topInset + 20;

  return (
    <View style={[styles.wrapper, { height: scrimHeight }]} pointerEvents="none">
      <Svg height={scrimHeight} width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="statusBarGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={baseColor} stopOpacity="0.96" />
            <Stop offset="0.55" stopColor={baseColor} stopOpacity="0.82" />
            <Stop offset="0.85" stopColor={baseColor} stopOpacity="0.30" />
            <Stop offset="1" stopColor={baseColor} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height={scrimHeight} fill="url(#statusBarGradient)" />
      </Svg>
      {/* Sombra difusa proyectada hacia abajo */}
      <View style={[styles.shadowOverlay, { height: topInset }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  shadowOverlay: {
    width: '100%',
    shadowColor: '#36241D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
});
