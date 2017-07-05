import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View
} from 'react-native';
import { recognizable, Zoomable, Swipeable } from 'react-native-gesture-wrapper';

const ZoomView = recognizable(View);

export default class Example extends Component {
  _onZoomBegin = (zoom) => {
    console.log('Zoom Start ', zoom);
  }

  _onZoomEnd = (zoom) => {
    console.log('Zoom End ', zoom)
  }

  _onSwipeBegin = (direction) => {
    console.log('Swipe Start ', direction);
  }

  _onSwipeEnd = (direction) => {
    console.log('Swipe End ', direction);
  }

  recognizers = [new Zoomable({}, {
    onZoomBegin: this._onZoomBegin,
    onZoomEnd: this._onZoomEnd,
  }), new Swipeable({}, {
    onSwipeBegin: this._onSwipeBegin,
    onSwipeEnd: this._onSwipeEnd,
  })];

  render() {
    return (
      <ZoomView style={{ flex: 1, backgroundColor: 'red' }}
        recognizers={this.recognizers}
      >
        <Text>View</Text>
        <View style={styles.view}></View>
        <View style={styles.divider}></View>

        <Text>Text</Text>
        <Text>Some Text</Text>
        <View style={styles.divider}></View>

        <Text>TextInput</Text>
        <TextInput style={styles.textInput}></TextInput>
        <View style={styles.divider}></View>

        <Text>Image</Text>
        <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
               style={styles.image} />
        <View style={styles.divider}></View>

        <Text>Touchable*</Text>
        <TouchableOpacity style={styles.rect}></TouchableOpacity>
      </ZoomView>

    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: 100,
    height: 100,
    borderWidth: 1
  },
  textInput: {
    width: 100
  },
  image: {
    width: 100,
    height: 100
  },
  rect: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd'
  },
  divider: {
    marginBottom: 25
  }
});
