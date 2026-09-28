import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store';
export function BottomNav() { 
    const { currentScreen, navigateTo } = useApp(); 
    const active = currentScreen === 'interactive_map' || currentScreen === 'nearby_routes' ? 'map' : currentScreen === 'favorites' ? 'saved' : currentScreen === 'profile' || currentScreen === 'settings' ? 'profile' : currentScreen === 'explore_category' || currentScreen === 'search' || currentScreen === 'recommendations' ? 'explore' : 'home'; 
    return <View style={styles.nav}>
        {[['home', '⌂', 'Inicio'], 
        ['explore', '⌕', 'Explorar'], 
        ['map', '⌖', 'Mapa'], 
        ['saved', '♡', 'Guardados'], 
        ['profile', '◉', 'Perfil']].map(([key, icon, label]) => 
        <Pressable key={key} 
        style={styles.item} 
        onPress={() => navigateTo(key === 'explore' ? 'explore_category' : key === 'map' ? 'interactive_map' : key === 'saved' ? 'favorites' : key as 'home' | 'profile')}>
            <Text style={[styles.icon, active === key && styles.active]}>
                {icon}
                </Text>
                <Text style={[styles.label, active === key && styles.active]}>
                    {label}
                    </Text>
                    </Pressable>
                    )}
                    </View>; 
                    }
const styles = StyleSheet.create({ nav: { height: 76, backgroundColor: '#FFFFFFF5', borderTopWidth: 1, borderTopColor: '#F0E4DC', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 5 }, item: { alignItems: 'center', minWidth: 64 }, icon: { color: '#806F69', fontSize: 24 }, label: { color: '#806F69', fontSize: 10, fontWeight: '700', marginTop: 3 }, active: { color: '#FF7A59' } });
