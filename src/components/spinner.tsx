import {Animated, Easing, Image} from 'react-native';
import {IMAGES} from '../constants/source';
import {useEffect, useRef} from 'react';

const Spinner: React.FC<{size?: number}> = ({size}) => {
  const spinnerRef = useRef(new Animated.Value(0)).current;

  const rotationAnimation = () => {
    Animated.loop(
      Animated.timing(spinnerRef, {
        duration: 1000,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const rotate = spinnerRef.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    rotationAnimation();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{rotateZ: rotate}],
        width: size ?? 20,
        height: size ?? 20,
      }}>
      <Image
        source={IMAGES.SPINNER}
        style={{width: size ?? 20, height: size ?? 20}}
      />
    </Animated.View>
  );
};

export default Spinner;
