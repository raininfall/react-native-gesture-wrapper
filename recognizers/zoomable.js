import _ from 'lodash';

import Recognizer from './recognizer';

const defaultOptions = {
  enable: true,
  zoomInThreshold: 1.3,
  zoomOutThreshold: 0.7,
};

const defaultCallbacks = {
  onZoomBegin: () => {},
  onZoomEnd: () => {},
};

export default class Zoomable extends Recognizer{
  static ZOOM_IN = 0;
  static ZOOM_OUT = 1;

  constructor(options, cbs) {
    super();

    this.options = _.defaults(options, defaultOptions);
    this.cbs = _.defaults(cbs, defaultCallbacks);

    this.onZoomBegin = this.onZoomEnd = () => {};
    this.setStateNotWorking();
  }

  _onZoomBegin = (zoom) => {
    this.cbs.onZoomBegin(zoom);
    this.onZoomEnd = _.once(this._onZoomEnd.bind(this, zoom));
  }

  _onZoomEnd = (zoom) => {
    this.setStateNotWorking();
    this.cbs.onZoomEnd(zoom);
  }

  isStateValid(event, gestureState) {
    return this.options.enable && gestureState.numberActiveTouches === 2;
  }

  isStateWorking() {
    return !!this.distant;
  }

  setStateWorking(distant) {
    this.distant = distant;
  }

  setStateNotWorking() {
    this.distant = null;
  }

  onStartShouldSetPanResponder(event, gestureState) {
    return this.isStateValid(event, gestureState);
  }

  onMoveShouldSetPanResponder(event, gestureState) {
    return this.isStateValid(event, gestureState);
  }

  onPanResponderGrant(event, gestureState) {
    // move code to onPanResponderMove
  }

  onPanResponderMove(event, gestureState) {
    if (!this.isStateValid(event, gestureState)) {
      if (this.isStateWorking) {
        this.onZoomEnd();
      }
      return;
    }

    const { nativeEvent } = event;
    const dx = Math.abs(nativeEvent.touches[0].pageX - nativeEvent.touches[1].pageX);
    const dy = Math.abs(nativeEvent.touches[0].pageY - nativeEvent.touches[1].pageY);
    const distant = Math.sqrt(dx * dx + dy * dy);

    if (this.isStateWorking()) {
      const scale = distant / this.distant;
      if (scale > this.options.zoomInThreshold) {
        this.onZoomBegin(Zoomable.ZOOM_IN);
      } else if (scale < this.options.zoomOutThreshold) {
        this.onZoomBegin(Zoomable.ZOOM_OUT);
      }
    } else {
      this.setStateWorking(distant);
      this.onZoomBegin = _.once(this._onZoomBegin);
    }
  }

  onPanResponderEnd(event, gestureState) {
    this.onZoomEnd();
  }

  onPanResponderRelease(event, gestureState) {
    this.onZoomEnd();
  }

}
