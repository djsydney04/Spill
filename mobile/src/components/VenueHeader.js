import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { theme } from '../theme';

export const VenueHeader = ({ venue, style }) => {
  const checkins = useSelector((state) => state.venues.checkins[venue.id] || []);
  const currentVibeRating = useSelector((state) => {
    const venuePosts = state.posts.posts.filter(p => p.venueId === venue.id);
    if (venuePosts.length === 0) return 0;
    const sum = venuePosts.reduce((acc, post) => acc + post.vibeRating, 0);
    return Math.round(sum / venuePosts.length);
  });

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
    Linking.openURL(url);
  };

  const renderVibeRating = () => {
    const icons = [];
    for (let i = 0; i < 5; i++) {
      icons.push(
        <MaterialCommunityIcons
          key={i}
          name={i < currentVibeRating ? 'star' : 'star-outline'}
          size={24}
          color={theme.colors.primary}
        />
      );
    }
    return <View style={styles.vibeContainer}>{icons}</View>;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: venue.imageUrl }}
        style={styles.backgroundImage}
        blurRadius={3}
      />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.address}>{venue.address}</Text>
          
          {renderVibeRating()}

          <View style={styles.stats}>
            <View style={styles.stat}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statText}>
                {checkins.length} people here now
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={handleDirections}
          >
            <MaterialCommunityIcons
              name="directions"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.directionsText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  vibeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    color: 'white',
    fontSize: 16,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  directionsText: {
    color: theme.colors.primary,
    marginLeft: 4,
    fontSize: 16,
  },
});
