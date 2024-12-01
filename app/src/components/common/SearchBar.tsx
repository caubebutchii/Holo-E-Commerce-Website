import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SearchBarProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  onPressSearch: () => void;
  onPressFilter: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChangeText, onPressSearch, onPressFilter }) => {
  const [searchText, setSearchText] = useState('');

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChangeText(text);
  };

  return (
    <LinearGradient
      colors={['#dcf1f9', '#dcf1f9']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#323660" />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={handleChangeText}
            value={searchText}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={onPressSearch} style={styles.searchButton}>
              <Ionicons name="arrow-forward" size={20} color="#cbf6f7" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onPressFilter} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#323660" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 26,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
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
    paddingVertical: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#0dd7df',
    borderRadius: 8,
    padding: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});

export default SearchBar;