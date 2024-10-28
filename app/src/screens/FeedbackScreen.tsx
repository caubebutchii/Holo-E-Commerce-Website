import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedbackScreen = () => {
  const [mood, setMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);
  const [aspects, setAspects] = useState({
    Service: false,
    Quantity: false,
    Payment: false,
    Delivery: false,
    Promotion: false,
    Gift: false,
  });
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const toggleAspect = (aspect: string) => {
    setAspects(prev => ({ ...prev, [aspect]: !prev[aspect] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <View style={styles.moodContainer}>
        <TouchableOpacity onPress={() => setMood('sad')} style={styles.moodButton}>
          <Ionicons name="sad-outline" size={32} color={mood === 'sad' ? '#007AFF' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMood('neutral')} style={styles.moodButton}>
          <Ionicons name="happy-outline" size={32} color={mood === 'neutral' ? '#007AFF' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMood('happy')} style={styles.moodButton}>
          <Ionicons name="happy" size={32} color={mood === 'happy' ? '#007AFF' : '#000'} />
        </TouchableOpacity>
      </View>
      <View style={styles.aspectsContainer}>
        {Object.entries(aspects).map(([aspect, isSelected]) => (
          <TouchableOpacity
            key={aspect}
            style={[styles.aspectButton, isSelected && styles.selectedAspect]}
            onPress={() => toggleAspect(aspect)}
          >
            <Text style={[styles.aspectText, isSelected && styles.selectedAspectText]}>{aspect}</Text>
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Care to share more?</Text>
      <TextInput
        style={styles.feedbackInput}
        multiline
        placeholder="Type your feedback"
        value={feedback}
        onChangeText={setFeedback}
      />
      <Text style={styles.sectionTitle}>Upload images</Text>
      <View style={styles.imageUploadContainer}>
        <TouchableOpacity style={styles.imageUploadButton}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.uploadedImageContainer}>
          <Image source={{ uri: 'https://example.com/headphone.jpg' }} style={styles.uploadedImage} />
          <TouchableOpacity style={styles.removeImageButton}>
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
      </View>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  moodButton: {
    padding: 8,
  },
  aspectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  aspectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAspect: {
    backgroundColor: '#007AFF',
  },
  aspectText: {
    marginRight: 4,
  },
  selectedAspectText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  imageUploadButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImageContainer: {
    marginLeft: 8,
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;