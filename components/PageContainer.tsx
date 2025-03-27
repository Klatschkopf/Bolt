import { ReactNode, useCallback, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface PageContainerProps {
  children: ReactNode;
  currentIndex: number;
  totalPages: number;
  onChangePage: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

export default function PageContainer({
  children,
  currentIndex,
  totalPages,
  onChangePage,
}: PageContainerProps) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const isAnimating = useSharedValue(false);
  const activePointer = useRef<number | null>(null);

  const updatePage = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, totalPages - 1)
      : Math.max(currentIndex - 1, 0);
    onChangePage(newIndex);
  }, [currentIndex, totalPages, onChangePage]);

  const gesture = Gesture.Pan()
    .onStart((event) => {
      if (activePointer.current !== null) return;
      activePointer.current = event.pointerId;
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      if (event.pointerId !== activePointer.current || isAnimating.value) return;

      if (
        (currentIndex === 0 && event.translationX > 0) ||
        (currentIndex === totalPages - 1 && event.translationX < 0)
      ) {
        translateX.value = event.translationX * 0.2;
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.pointerId !== activePointer.current) return;
      activePointer.current = null;

      if (isAnimating.value) return;

      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        isAnimating.value = true;
        if (event.translationX > 0 && currentIndex > 0) {
          translateX.value = withTiming(width, {}, () => {
            translateX.value = -width;
            translateX.value = withTiming(0);
            runOnJS(updatePage)('prev');
            isAnimating.value = false;
          });
        } else if (event.translationX < 0 && currentIndex < totalPages - 1) {
          translateX.value = withTiming(-width, {}, () => {
            translateX.value = width;
            translateX.value = withTiming(0);
            runOnJS(updatePage)('next');
            isAnimating.value = false;
          });
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
          isAnimating.value = false;
        }
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    })
    .onFinalize(() => {
      activePointer.current = null;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const content = (
    <Animated.View style={[styles.content, animatedStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        content
      ) : (
        <GestureDetector gesture={gesture}>
          {content}
        </GestureDetector>
      )}
      <View style={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  paginationDotActive: {
    backgroundColor: '#7FD4D2',
    width: 24,
  },
});
