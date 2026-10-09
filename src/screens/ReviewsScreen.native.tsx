import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { RatingStars } from '../components/RatingStars.native';
import { createReview } from '../services/api';

export function ReviewsScreen() {
  const { selectedPlace, currentUser, reviews, goBack } = useApp();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const publish = async () => {
    if (!currentUser || !selectedPlace || !comment.trim()) {
      return Alert.alert('Completa tu reseña', 'Escribe un comentario para publicar.');
    }
    try {
      await createReview({
        placeId: selectedPlace.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarUrl,
        rating,
        comment,
      });
      setComment('');
      Alert.alert('Reseña publicada', 'Gracias por compartir tu experiencia.');
    } catch {
      Alert.alert('Error', 'No se pudo publicar la reseña.');
    }
  };

  const visible = reviews.filter((review) => review.placeId === selectedPlace?.id);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
        <Text style={styles.back}>‹ Volver</Text>
      </Pressable>
      <Text style={styles.title}>Reseñas</Text>
      <Text style={styles.subtitle}>{selectedPlace?.name || 'Experiencias de viajeros'}</Text>

      {visible.map((review) => (
        <View key={review.id} style={styles.review}>
          <Text style={styles.author}>{review.userName}</Text>
          <RatingStars rating={review.rating} size="sm" />
          <Text style={styles.comment}>{review.comment}</Text>
        </View>
      ))}

      {currentUser && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Comparte tu experiencia</Text>
          <RatingStars rating={rating} interactive onChange={setRating} size="lg" />
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Cuéntanos cómo fue tu visita..."
            placeholderTextColor="#806F69"
            multiline
            style={styles.input}
          />
          <Pressable style={styles.button} onPress={publish}>
            <Text style={styles.buttonText}>Publicar reseña</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 14, marginTop: 4, marginBottom: 18 },
  review: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  author: { color: '#1E1927', fontSize: 15, fontWeight: '900', marginBottom: 6 },
  comment: { color: '#58423C', fontSize: 14, lineHeight: 20, marginTop: 8 },
  form: { padding: 16, borderRadius: 18, backgroundColor: '#FFF0EB', marginTop: 12 },
  formTitle: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginBottom: 12 },
  input: {
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    color: '#1E1927',
    textAlignVertical: 'top',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F0E4DC',
  },
  button: {
    backgroundColor: '#FF7A59',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 12,
    shadowColor: '#FF7A59',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
});
