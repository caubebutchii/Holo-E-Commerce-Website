import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterScreen = ({navigation}:any) => {
  const [shippingOptions, setShippingOptions] = useState({
    instant: false,
    express: false,
    standard: false,
  });
  const [priceRange, setPriceRange] = useState({ min: '10', max: '1000' });
  const [averageReview, setAverageReview] = useState(4);

  const toggleShippingOption = (option: keyof typeof shippingOptions) => {
    setShippingOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping options</Text>
        <TouchableOpacity style={styles.optionRow} onPress={() => toggleShippingOption('instant')}>
          <Ionicons
            name={shippingOptions.instant ? 'checkbox' : 'square-outline'}
            size={24}
            color="#007AFF"
          />
          <Text style={styles.optionText}>Instant (2 hours delivery)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} onPress={() => toggleShippingOption('express')}>
          <Ionicons
            name={shippingOptions.express ? 'checkbox' : 'square-outline'}
            size={24}
            color="#007AFF"
          />
          <Text style={styles.optionText}>Express (2 days delivery)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} onPress={() => toggleShippingOption('standard')}>
          <Ionicons
            name={shippingOptions.standard ? 'checkbox' : 'square-outline'}
            size={24}
            color="#007AFF"
          />
          <Text style={styles.optionText}>Standard (7-10 days delivery)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price range</Text>
        <View style={styles.priceInputContainer}>
          <TextInput
            style={styles.priceInput}
            value={priceRange.min}
            onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.priceInput}
            value={priceRange.max}
            onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.slider}>
          <View style={styles.sliderTrack} />
          <View style={styles.sliderFill} />
          <View style={[styles.sliderThumb, { left: '0%' }]} />
          <View style={[styles.sliderThumb, { right: '0%' }]} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Average review</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setAverageReview(star)}>
              <Ionicons
                name={star <= averageReview ? 'star' : 'star-outline'}
                size={32}
                color={star <= averageReview ? '#FFD700' : '#C0C0C0'}
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingText}>& Up</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Others</Text>
        <View style={styles.otherOptionsContainer}>
          <TouchableOpacity style={styles.otherOption}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
            <Text style={styles.otherOptionText}>30-day Free Return</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherOption}>
            <Ionicons name="shield-checkmark" size={24} color="#000" />
            <Text style={styles.otherOptionText}>Buyer Protection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherOption}>
            <Ionicons name="pricetag" size={24} color="#000" />
            <Text style={styles.otherOptionText}>Best Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherOption}>
            <Ionicons name="location" size={24} color="#000" />
            <Text style={styles.otherOptionText}>Ship to store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '48%',
  },
  slider: {
    height: 40,
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 18,
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#007AFF',
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: 18,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius:  10,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
  },
  otherOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  otherOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  otherOptionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default FilterScreen;