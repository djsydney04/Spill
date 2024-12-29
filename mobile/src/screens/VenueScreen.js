import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PostCard } from '../components/PostCard';
import { VenueHeader } from '../components/VenueHeader';
import { FloatingButton } from '../components/FloatingButton';
import { fetchVenuePosts } from '../store/slices/postSlice';
import { theme } from '../theme';
import { socket } from '../services/socket';

export const VenueScreen = ({ route, navigation }) => {
  const { venueId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const venue = useSelector((state) => 
    state.venues.venues.find(v => v.id === venueId)
  );
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    loadPosts();
    socket.emit('join-venue', venueId);

    // Listen for real-time updates
    socket.on('new-post', handleNewPost);
    socket.on('delete-post', handleDeletePost);

    return () => {
      socket.emit('leave-venue', venueId);
      socket.off('new-post');
      socket.off('delete-post');
    };
  }, [venueId]);

  const loadPosts = async () => {
    try {
      await dispatch(fetchVenuePosts(venueId));
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleNewPost = (post) => {
    if (post.venueId === venueId) {
      dispatch({ type: 'posts/addPost', payload: post });
    }
  };

  const handleDeletePost = (postId) => {
    dispatch({ type: 'posts/removePost', payload: postId });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false));
  }, [venueId]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 60],
    extrapolate: 'clamp',
  });

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      onUserPress={(userId) => navigation.navigate('Profile', { userId })}
      onLike={() => dispatch(likePost(item.id))}
      onComment={() => navigation.navigate('Comments', { postId: item.id })}
    />
  );

  if (!venue) {
    return (
      <View style={styles.centerContainer}>
        <Text>Venue not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <VenueHeader
          venue={venue}
          style={{ opacity: scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          })}}
        />
      </Animated.View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.listContainer}
      />

      <FloatingButton
        icon="camera"
        onPress={() => navigation.navigate('Camera', { venueId })}
        style={styles.cameraButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: theme.colors.primary,
  },
  listContainer: {
    paddingTop: 200, // Initial header height
    paddingBottom: 16,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
