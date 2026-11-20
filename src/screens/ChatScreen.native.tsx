import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../assets/images';
import { sendChatMessage } from '../services/api';
import { useApp } from '../store';
import { Place } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedPlaces?: Place[];
  createdAt: string;
}

const QUICK_PROMPTS = [
  '🍲 ¿Dónde comer el mejor chicharrón?',
  '🌊 Atardeceres y playas en Salgar',
  '🎨 Artesanías y murales en Usiacurí',
  '👨‍👩‍👧‍👦 Plan familiar con niños',
  '🐟 Arepa de huevo en Luruaco',
];

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { places, navigateTo, goBack } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Ajá! Soy Ruti, tu guía del Atlántico. Conozco cada rincón desde Bocas de Ceniza hasta la Laguna de Luruaco. ¿Qué se te antoja hacer hoy? Dime si buscas comida sabrosa, playas tranquilas, artesanías o planes familiares.',
      suggestedPlaces: places.filter((p) => p.id === '1' || p.id === '14'),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage(text, historyPayload);

      // Vincular los IDs de lugares devueltos con los datos del catálogo en la app
      const matchedPlaces = Array.isArray(res.suggestedPlaceIds)
        ? res.suggestedPlaceIds
            .map((id) => places.find((p) => String(p.id) === String(id)))
            .filter((p): p is Place => Boolean(p))
        : [];

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: res.reply,
        suggestedPlaces: matchedPlaces,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'bot',
          text: '¡Oye! Se me cayó un momento la señal con la brisa costera. Intenta preguntarme de nuevo.',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <Image
            source={IMAGES.brand.officialIcon}
            style={styles.botAvatar}
            contentFit="cover"
            transition={150}
          />
        )}

        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>

          {/* Tarjetas interactivas de lugares recomendados */}
          {item.suggestedPlaces && item.suggestedPlaces.length > 0 && (
            <View style={styles.placesContainer}>
              <Text style={styles.placesTitle}>📍 Lugares recomendados:</Text>
              {item.suggestedPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.placeCard}
                  onPress={() => navigateTo('place_detail', { placeId: place.id })}
                >
                  {place.images?.[0] ? (
                    <Image
                      source={place.images[0]}
                      style={styles.placeImage}
                      contentFit="cover"
                      transition={150}
                    />
                  ) : null}
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeMuni}>{place.municipality}</Text>
                    <Text style={styles.placeName} numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text style={styles.placeLink}>Ver detalles e indicaciones →</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={[styles.timeText, isUser ? styles.userTime : styles.botTime]}>
            {item.createdAt}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header oficial con la mascota Ruti */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 6 }]}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#E60124" />
        </Pressable>

        <Image
          source={IMAGES.brand.officialMascot}
          style={styles.headerMascot}
          contentFit="contain"
          transition={150}
        />

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.headerTitle}>Ruti</Text>
            <View style={styles.onlineBadge} />
            <Text style={styles.onlineText}>En línea</Text>
          </View>
          <Text style={styles.headerSubtitle}>Guía Turístico IA del Atlántico</Text>
        </View>
      </View>

      {/* Lista de mensajes */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          loading ? (
            <View style={styles.typingContainer}>
              <Image
                source={IMAGES.brand.officialIcon}
                style={styles.botAvatarSmall}
                contentFit="cover"
              />
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#E60124" />
                <Text style={styles.typingText}>Ruti está pensando su recomendación...</Text>
              </View>
            </View>
          ) : undefined
        }
      />

      {/* Sugerencias rápidas */}
      <View style={styles.promptsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsScroll}
        >
          {QUICK_PROMPTS.map((prompt, i) => (
            <Pressable
              key={i}
              style={styles.promptChip}
              onPress={() => handleSend(prompt)}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Barra de entrada de texto */}
      <View
        style={[
          styles.inputBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Pregúntale a Ruti sobre el Atlántico..."
          placeholderTextColor="#8A8A8A"
          multiline
          maxLength={300}
        />
        <Pressable
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 4,
    marginRight: 6,
  },
  headerMascot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#E60124',
    fontSize: 18,
    fontWeight: '900',
  },
  onlineBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5DB872',
  },
  onlineText: {
    color: '#5DB872',
    fontSize: 11,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  botAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#E60124',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  botText: {
    color: '#1E1927',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  botTime: {
    color: '#8A8A8A',
  },
  placesContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    gap: 8,
  },
  placesTitle: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 8,
    alignItems: 'center',
    gap: 10,
  },
  placeImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  placeInfo: {
    flex: 1,
  },
  placeMuni: {
    color: '#E60124',
    fontSize: 9.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  placeName: {
    color: '#1E1927',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1,
  },
  placeLink: {
    color: '#5DB872',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDE8EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  typingText: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '700',
  },
  promptsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingVertical: 8,
  },
  promptsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  promptText: {
    color: '#1E1927',
    fontSize: 12,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E1927',
    maxHeight: 90,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E60124',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
