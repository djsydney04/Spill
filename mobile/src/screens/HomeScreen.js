import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { VenueCard } from '../components/VenueCard';
import { MapView } from '../components/MapView';
import { FloatingButton } from '../components/FloatingButton';
import { fetchNearbyVenues } from '../store/slices/venueSlice';
import { useLocation } from '../hooks/useLocation';
import { theme } from '../theme';

export const HomeScreen = ({ navigation }) => {
  const [isMapView, setIsMapView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { venues, loading } = useSelector((state) => state.venues);
  const { location } = useLocation();

  useEffect(() => {
    if (location) {
      dispatch(fetchNearbyVenues(location));
    }
  }, [location, dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchNearbyVenues(location)).finally(() => setRefreshing(false));
  }, [dispatch, location]);

  const renderVenue = ({ item }) => (
    <VenueCard
      venue={item}
      onPress={() => navigation.navigate('Venue', { venueId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      {isMapView ? (
        <MapView
          venues={venues}
          onVenuePress={(venue) =>
            navigation.navigate('Venue', { venueId: venue.id })
          }
        />
      ) : (
        <FlatList
          data={venues}
          renderItem={renderVenue}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.buttonContainer}>
        <FloatingButton
          icon={isMapView ? 'list' : 'map'}
          onPress={() => setIsMapView(!isMapView)}
        />
        <FloatingButton
          icon="camera"
          onPress={() => navigation.navigate('Camera')}
          style={styles.cameraButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  cameraButton: {
    marginLeft: 16,
  },
});
