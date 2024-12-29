import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postSlice';
import { FloatingButton } from '../components/FloatingButton';
import { VibeRatingPicker } from '../components/VibeRatingPicker';
import { theme } from '../theme';

export const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [vibeRating, setVibeRating] = useState(3);
  const [caption, setCaption] = useState('');
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const { currentVenue } = useSelector((state) => state.venues);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted' && locationStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      setPhoto(photo);
    }
  };

  const handlePost = async () => {
    if (!photo || !currentVenue) {
      Alert.alert('Error', 'Please take a photo and select a venue');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      formData.append('venueId', currentVenue.id);
      formData.append('caption', caption);
      formData.append('vibeRating', vibeRating);

      await dispatch(createPost(formData));
      navigation.navigate('Venue', { venueId: currentVenue.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <VibeRatingPicker value={vibeRating} onChange={setVibeRating} />
          <View style={styles.buttonContainer}>
            <FloatingButton
              icon="close"
              onPress={() => setPhoto(null)}
              style={styles.cancelButton}
            />
            <FloatingButton
              icon="send"
              onPress={handlePost}
              style={styles.postButton}
            />
          </View>
        </View>
      ) : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <FloatingButton
              icon="flip-camera"
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            />
            <FloatingButton
              icon="camera"
              onPress={takePicture}
              style={styles.captureButton}
            />
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  captureButton: {
    marginLeft: 16,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  postButton: {
    marginLeft: 16,
    backgroundColor: theme.colors.success,
  },
});
