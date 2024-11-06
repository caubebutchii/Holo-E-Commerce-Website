import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SearchBar = ({ placeholder, onChangeText, onPressSearch, onPressFilter }: any) => {
  return (
    <LinearGradient
      colors={['#8B4513', '#D2691E']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={onChangeText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity onPress={onPressFilter} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
   
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});

export default SearchBar;