import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    isLoading: true,
    images: [],
    scale: new Animated.Value(1),
    isImageFocused: false
  };

  scale = {
    transform: [{ scale: this.state.scale }]
  };

  actionBarY = this.state.scale.interpolate({
    inputRange: [0.9, 1],
    outputRange: [0, -80]
  });

  componentDidMount() {
    this.loadWallpapers();
  }

  loadWallpapers = () => {
    axios
      .get(
        'https://api.unsplash.com/photos/random?count=30&client_id=c6dc42f21ea956b65a8e4bde68c825f6de8bf17425182317ed5c2802b8621fe1'
      )
      .then(({ data }) => {
        this.setState({ images: data, isLoading: false });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        console.log('Request completed');
      });
  };

  showControls = () => {
    this.setState(
      prevState => ({
        isImageFocused: !prevState.isImageFocused
      }),
      () => {
        if (this.state.isImageFocused) {
          Animated.spring(this.state.scale, {
            toValue: 0.9
          }).start();
        } else {
          Animated.spring(this.state.scale, {
            toValue: 1
          }).start();
        }
      }
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
        <TouchableWithoutFeedback onPress={this.showControls}>
          <Animated.View style={[{ height, width }, this.scale]}>
            <Image
              style={{
                flex: 1,
                height: null,
                width: null,
                resizeMode: 'cover'
              }}
              source={{ uri: item.urls.regular }}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: this.actionBarY,
            height: 80,
            backgroundColor: 'black'
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              onPress={() => {
                alert('load images');
              }}
              activeOpacity={0.5}
            >
              <Ionicons name="ios-refresh" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              onPress={() => {
                alert('load images');
              }}
              activeOpacity={0.5}
            >
              <Ionicons name="ios-share" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              onPress={() => {
                alert('load images');
              }}
              activeOpacity={0.5}
            >
              <Ionicons name="ios-save" color="white" size={40} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  render() {
    return this.state.isLoading ? (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <View style={styles.container}>
        <FlatList
          scrollEnabled={!this.state.isImageFocused}
          horizontal
          pagingEnabled
          data={this.state.images}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
