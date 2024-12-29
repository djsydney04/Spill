import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export const PostCard = ({ post, onUserPress, onLike, onComment }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isLiked = post.likes?.some((like) => like.userId === currentUser?.id);

  const renderVibeRating = () => {
    const icons = [];
    for (let i = 0; i < 5; i++) {
      icons.push(
        <MaterialCommunityIcons
          key={i}
          name={i < post.vibeRating ? 'star' : 'star-outline'}
          size={16}
          color={theme.colors.primary}
        />
      );
    }
    return <View style={styles.vibeContainer}>{icons}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onUserPress(post.user.id)}
          style={styles.userInfo}
        >
          <Image
            source={{ uri: post.user.profileImageUrl }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{post.user.username}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Text>
          </View>
        </TouchableOpacity>
        {renderVibeRating()}
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.image} />

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike} style={styles.actionButton}>
            <MaterialCommunityIcons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? theme.colors.error : theme.colors.text}
            />
            <Text style={styles.actionText}>
              {post.likes?.length || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={styles.actionButton}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={styles.actionText}>
              {post.comments?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>

        {post.caption && (
          <Text style={styles.caption}>{post.caption}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  vibeContainer: {
    flexDirection: 'row',
  },
  image: {
    width: width - 32,
    height: width - 32,
    borderRadius: 8,
  },
  footer: {
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: theme.colors.text,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 8,
  },
});
