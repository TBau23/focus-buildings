// components/IsometricGrid.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

  /* -------- config (edit once) ------------------------------------------- */
  export const TILE_W = 64;
  export const TILE_H = 32;
  export const MAP_W  = 12;
  export const MAP_H  = 12;
  /* ----------------------------------------------------------------------- */

export type Building = {
  id: string | number;
  gx: number;
  gy: number;
  wPx: number;
  hPx: number;
  src: any;            // require('…') or { uri }
};

const toScreen = (gx: number, gy: number) => ({
  x: (gx - gy) * (TILE_W / 2),
  y: (gx + gy) * (TILE_H / 2),
});

type Props = { buildings: Building[]; showGrid?: boolean };

export default function IsometricGrid({ buildings, showGrid = true }: Props) {
  /* ------------------------------------------------------------------ */
  /* 1. shared animated values                                          */
  /* ------------------------------------------------------------------ */
  const scale = useSharedValue(1);
  const tx    = useSharedValue(0);
  const ty    = useSharedValue(0);

  /* ------------------------------------------------------------------ */
  /* 2. gestures (mobile + mouse-drag)                                  */
  /* ------------------------------------------------------------------ */
  const pan = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => { ctx.x = tx.value; ctx.y = ty.value; },
    onActive: (e, ctx: any) => {
      tx.value = ctx.x + e.translationX;
      ty.value = ctx.y + e.translationY;
    },
  });

  const pinch = useAnimatedGestureHandler({
    onActive: (e) => {
      scale.value = Math.min(2, Math.max(0.5, e.scale));
    },
    onEnd: () => {
      scale.value = withTiming(scale.value < 0.6 ? 0.6 : scale.value);
    },
  });

  /* mouse-wheel zoom for Expo-web */
  const wheelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (Platform.OS !== 'web' || !wheelRef.current) return;
    const el = wheelRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY / 500;        // tweak sensitivity
      const next  = Math.min(2, Math.max(0.5, scale.value + delta));
      scale.value = next;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const boardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  /* ------------------------------------------------------------------ */
  /* 3. helpers                                                          */
  /* ------------------------------------------------------------------ */
  const renderGrid = useCallback(() => {
    if (!showGrid) return null;
    const diamonds = [];
    // Center the grid by offsetting the starting position
    const offsetX = (MAP_W * TILE_W) / 2;
    const offsetY = (MAP_H * TILE_H) / 2;
    
    for (let gy = 0; gy < MAP_H; gy++) {
      for (let gx = 0; gx < MAP_W; gx++) {
        const { x, y } = toScreen(gx, gy);
        diamonds.push(
          <Polygon
            key={`d-${gx}-${gy}`}
            points={`${x},${y + TILE_H / 2} ${x + TILE_W / 2},${y} ${x + TILE_W},${y + TILE_H / 2} ${x + TILE_W / 2},${y + TILE_H}`}
            fill="#c8e6c9"                     /* light-grass fill  */
            stroke="#9ccc65"                   /* soft outline      */
            strokeWidth="1"
          />,
        );
      }
    }
    return (
      <Svg
        width={MAP_W * TILE_W}
        height={MAP_H * TILE_H}
        style={[StyleSheet.absoluteFill, { marginLeft: -offsetX, marginTop: -offsetY }]}
        pointerEvents="none"
      >
        {diamonds}
      </Svg>
    );
  }, [showGrid]);

  const renderBuildings = () =>
    buildings
      .slice()
      .sort((a, b) => a.gx + a.gy - (b.gx + b.gy))
      .map((b) => {
        const { x, y } = toScreen(b.gx, b.gy);
        // Scale down large buildings to fit better in the grid
        const maxWidth = TILE_W * 2; // Allow buildings to span 2 tiles wide
        const maxHeight = TILE_H * 3; // Allow buildings to be 3 tiles tall
        const scale = Math.min(maxWidth / b.wPx, maxHeight / b.hPx, 1);
        const scaledWidth = b.wPx * scale;
        const scaledHeight = b.hPx * scale;
        
        return (
          <Image
            key={b.id}
            source={b.src}
            resizeMode="contain"
            style={{
              position: 'absolute',
              width:  scaledWidth,
              height: scaledHeight,
              left:   x - scaledWidth / 2,
              top:    y - scaledHeight,
            }}
          />
        );
      });

  /* ------------------------------------------------------------------ */
  /* 4. render                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <GestureHandlerRootView style={{ flex: 1 }} ref={wheelRef as any}>
      <PanGestureHandler onGestureEvent={pan}>
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler onGestureEvent={pinch}>
            <Animated.View
              style={[
                styles.board,
                boardStyle,
                { width: MAP_W * TILE_W, height: MAP_H * TILE_H },
              ]}
            >
              {renderGrid()}
              {renderBuildings()}
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  board: { alignItems: 'flex-start', justifyContent: 'flex-start' },
});
