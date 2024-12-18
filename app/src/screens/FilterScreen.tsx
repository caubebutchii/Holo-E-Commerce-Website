import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const FilterScreen = ({ navigation, route }: any) => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string;[key: string]: any }[]>([]);
  const [products, setProducts] = useState<{ id: string;[key: string]: any }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchDataCate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategories(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    const fetchDataItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const fetchedItems: { id: string; [key: string]: any }[] = [];
        const fetchedTags = new Set<string>();
        const fetchedColors = new Set<string>();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            if (data.tags) {
              data.tags.forEach((tag: string) => fetchedTags.add(tag));
            }
            if (data.colors) {
              data.colors.forEach((color: string) => fetchedColors.add(color));
            }
            fetchedItems.push({ id: doc.id, ...data });
          }
        });
        setProducts(fetchedItems);
        setTags(Array.from(fetchedTags));
        setColors(Array.from(fetchedColors));
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    fetchDataCate();
    fetchDataItems();

    return () => {
      setCategories([]);
      setProducts([]);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePriceChange = (index: number, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = numValue;
      return newRange;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const applyFilters = () => {
    const filters = {
      priceRange: {
        min: Math.min(...priceRange),
        max: Math.max(...priceRange),
      },
      rating,
      category: selectedCategory,
      tags: selectedTags,
      colors: selectedColors,
    };

    navigation.navigate('ProductListing', { filters });
  };

  const CustomMarker = () => (
    <View style={styles.markerContainer}>
      <View style={styles.marker} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price range</Text>
        <View style={styles.priceRangeContainer}>
          <TextInput
            style={styles.priceInput}
            value={formatPrice(priceRange[0])}
            onChangeText={(text) => handlePriceChange(0, text)}
            keyboardType="numeric"
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput}
            value={formatPrice(priceRange[1])}
            onChangeText={(text) => handlePriceChange(1, text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.sliderContainer}>
          <MultiSlider
            values={[priceRange[0], priceRange[1]]}
            min={0}
            max={20000000}
            step={100000}
            sliderLength={280}
            onValuesChange={setPriceRange}
            selectedStyle={styles.selectedTrack}
            unselectedStyle={styles.unselectedTrack}
            containerStyle={styles.sliderContainerStyle}
            trackStyle={styles.track}
            customMarker={CustomMarker}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? '#FFD700' : '#C0C0C0'}
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingText}>& Up</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.optionsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.optionButton,
                selectedCategory === category.name && styles.selectedOption
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={[
                styles.optionText,
                selectedCategory === category.name && styles.selectedOptionText
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.optionsContainer}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedTags.includes(tag) && styles.selectedOption
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[
                styles.optionText,
                selectedTags.includes(tag) && styles.selectedOptionText
              ]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        <View style={styles.optionsContainer}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedColors.includes(color) && styles.selectedOption
              ]}
              onPress={() => toggleColor(color)}
            >
              <Text style={[
                styles.optionText,
                selectedColors.includes(color) && styles.selectedOptionText
              ]}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '45%',
    fontSize: 14,
  },
  priceSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  sliderContainerStyle: {
    height: 50,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: '#99FFEE',
  },
  unselectedTrack: {
    backgroundColor: '#E0E0E0',
  },
  markerContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marker: {
    width: 12,
    height: 12,
    backgroundColor: '#99FFEE',
    borderRadius: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterScreen;