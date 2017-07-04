import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View
} from 'react-native';
import { recognizable, Zoomable } from 'react-native-pinch-zoom-view';

const ZoomView = recognizable(View);

export default class Example extends Component {
  _onZoomBegin = (zoom) => {
    console.log('Zoom Start!');
  }

  _onZoomEnd = (zoom) => {
    console.log('Zoom End!')
  }

  recognizers = [new Zoomable({}, {
    onZoomBegin: this._onZoomBegin,
    onZoomEnd: this._onZoomEnd,
  })];

  _onSwipeBegin = () => {
    console.log('Swipe Begin!');
  }

  _onSwipeEnd = () => {
    console.log('Swipe End!');
  }  

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
