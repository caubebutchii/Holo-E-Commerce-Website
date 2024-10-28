import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewItem = ({ review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewerName}>{review.name}</Text>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
    <View style={styles.ratingContainer}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < review.rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
  </View>
);

const ReviewList = ({ productId }) => {
  // In a real app, you would fetch reviews based on the productId
  const reviews = [
    { id: 1, name: 'John Doe', date: '1 day ago', rating: 5, text: 'Great product, highly recommended!' },
    { id: 2, name: 'Jane Smith', date: '3 days ago', rating: 4, text: 'Good quality, but a bit pricey.' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontWeight: 'bold',
  },
  reviewDate: {
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ReviewList;