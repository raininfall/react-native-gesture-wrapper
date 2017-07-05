import _ from 'lodash';

import Recognizer from './recognizer';

const defaultOptions = {
  horizontal: true,
  vertical: true,
  left: true,
  right: true,
  up: true,
  down: true,
  initialVelocityThreshold: 0.7,
  verticalThreshold: 10,
  horizontalThreshold: 10,
};

const defaultCallbacks = {
  onSwipeBegin: () => {},
  onSwipeEnd: () => {},
};

const isValidSwipe = (velocity, directionalChange, velocityThreshold, changeThreshold) => {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalChange) < changeThreshold;
};

export default class Swipeable extends Recognizer{
  static SWIPE_UP = 'SWIPE_UP';
  static SWIPE_DOWN = 'SWIPE_DOWN';
  static SWIPE_LEFT = 'SWIPE_LEFT';
  static SWIPE_RIGHT = 'SWIPE_RIGHT';

  constructor(options, cbs) {
    super();

    this.options = _.defaults(options, defaultOptions);
    this.cbs = _.defaults(cbs, defaultCallbacks);

    this.swipeDirection = null;
  }

  isCheckHorizontal() {
    const { horizontal, left, right } = this.options;
    return horizontal || (left || right);
  }

  isCheckVertical() {
    const { vertical, up, down } = this.options;
    return vertical || (up || down);
  }

  isStateValid(event) {
    return (this.isCheckHorizontal() || this.isCheckVertical()) &&
      event.nativeEvent.touches.length === 1;
  }

  onStartShouldSetPanResponder(event) {
    return this.isStateValid(event);
  }

  onMoveShouldSetPanResponder(event) {
    return this.isStateValid(event);
  }

  onPanResponderMove(event, gestureState) {
    if (!this.isStateValid(event)) {
      this._onSwipeEnd();
      return;
    }
    /* speed optimize, not working logic */
    if (this.swipeDirection) {
      return;
    }

    const { dx, dy, vx, vy } = gestureState;
    const { initialVelocityThreshold, verticalThreshold, horizontalThreshold } = this.options;

    const validHorizontal = this.isCheckHorizontal() && isValidSwipe(
      vx, dy, initialVelocityThreshold, verticalThreshold
    );
    const validVertical = this.isCheckVertical() && isValidSwipe(
      vy, dx, initialVelocityThreshold, horizontalThreshold
    );

    if (validHorizontal) {
      const { horizontal, left, right } = this.options;
      if ((horizontal || left) && dx < 0) {
        return this._onSwipeBegin(Swipeable.SWIPE_LEFT);
      } else if ((horizontal || right) && dx > 0) {
        return this._onSwipeBegin(Swipeable.SWIPE_RIGHT);
      }
    } else if (validVertical) {
      const { vertical, up, down } = this.options;
      if ((vertical || up) && dy < 0) {
        return this._onSwipeBegin(Swipeable.SWIPE_UP);
      } else if ((vertical || down) && dy > 0) {
        return this._onSwipeBegin(Swipeable.SWIPE_DOWN);
      }
    }
  }

  onPanResponderEnd() {
    this._onSwipeEnd();
  }

  onPanResponderRelease() {
    this._onSwipeEnd();
  }

  _onSwipeBegin(direction) {
    this.swipeDirection = direction;
    this.cbs.onSwipeBegin(direction);
  }

  _onSwipeEnd() {
    if (this.swipeDirection) {
      this.cbs.onSwipeEnd(this.swipeDirection);
      this.swipeDirection = null;
    }
  }
}
