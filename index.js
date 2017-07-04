import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  PanResponder
} from 'react-native';
import _ from 'lodash';

import { 
  Recognizer,
  Zoomable
} from './recognizers';

export {
  Recognizer,
  Zoomable,
};

export const recognizable = (TheComponent) => (
  class extends Component {
    static defaultProps = {
      recognizers: [],
    };
    
    static propTypes = {
      ...TheComponent.propTypes,
      recognizers: PropTypes.arrayOf(PropTypes.instanceOf(Recognizer)),
    };

    onStartShouldSetPanResponder = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.some(recognizer => recognizer.onStartShouldSetPanResponder(event, gestureState));
    }

    onMoveShouldSetPanResponder = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.some(recognizer => recognizer.onMoveShouldSetPanResponder(event, gestureState));
    }

    onPanResponderGrant = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.forEach(recognizer => recognizer.onPanResponderGrant(event, gestureState));
    }

    onPanResponderMove = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.forEach(recognizer => recognizer.onPanResponderMove(event, gestureState));
    }

    onPanResponderEnd = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.forEach(recognizer => recognizer.onPanResponderEnd(event, gestureState));
    }

    onPanResponderRelease = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.forEach(recognizer => recognizer.onPanResponderRelease(event, gestureState));
    }

    onPanResponderTerminationRequest = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.every(recognizer => recognizer.onPanResponderTerminationRequest(event, gestureState));
    }
    
    onShouldBlockNativeResponder = (event, gestureState) => {
      const { recognizers } = this.props;
      return recognizers.every(recognizer => recognizer.onShouldBlockNativeResponder(event, gestureState));
    }

       
    componentWillMount() {
      this.gestureHandlers = PanResponder.create({
        onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
        onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
        onPanResponderGrant: this.onPanResponderGrant,
        onPanResponderMove: this.onPanResponderMove,
        onPanResponderEnd: this.onPanResponderEnd,
        onPanResponderRelease: this.onPanResponderRelease,
        onPanResponderTerminationRequest: this.onPanResponderTerminationRequest,
        onShouldBlockNativeResponder: this.onShouldBlockNativeResponder,
      });
    }
    render() {
      const {recognizers, ...props} = this.props;
      return (
        <TheComponent {...this.gestureHandlers.panHandlers} {...props} />
      )
    }
  }
);
