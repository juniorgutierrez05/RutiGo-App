import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RatingStarsProps = {
  rating: number;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  reviewCount?: number;
};

export function RatingStars({
  rating,
  max = 5,
  interactive,
  onChange,
  size = 'md',
  showBadge,
  reviewCount,
}: RatingStarsProps) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 26 : 18;

  if (showBadge) {
    return (
      <View style={styles.badge}>
        <Ionicons name="star" size={13} color="#FFB800" />
        <Text style={styles.badgeText}>{rating.toFixed(1)}</Text>
        {reviewCount !== undefined && <Text style={styles.count}>({reviewCount})</Text>}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, index) => {
        const value = index + 1;
        const isFilled = rating >= value;
        return (
          <Pressable
            key={value}
            disabled={!interactive}
            hitSlop={interactive ? 6 : 0}
            onPress={() => onChange?.(value)}
          >
            <Ionicons
              name={isFilled ? 'star' : 'star-outline'}
              size={iconSize}
              color={isFilled ? '#FFB800' : '#D9CEC7'}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#FFFFFFEE',
  },
  badgeText: { color: '#1E1927', fontSize: 12, fontWeight: '800' },
  count: { color: '#806F69', fontSize: 11 },
});
