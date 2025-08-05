// components/IsometricGrid.tsx
import React, { useCallback } from 'react';
import { Image, StyleSheet } from 'react-native';
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
export const MAP_W  = 20;   // logical columns
export const MAP_H  = 20;   // logical rows
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

export default function IsometricGrid({ buildings, showGrid = false }: Props) {
  /* animated state */
  const scale = useSharedValue(1);
  const tx    = useSharedValue(0);
  const ty    = useSharedValue(0);

  /* gestures */
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

  const boardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  /* helpers */
  const renderGrid = useCallback(() => {
    if (!showGrid) return null;
    const diamonds = [];
    for (let gy = 0; gy < MAP_H; gy++) {
      for (let gx = 0; gx < MAP_W; gx++) {
        const { x, y } = toScreen(gx, gy);
        diamonds.push(
          <Polygon
            key={`d-${gx}-${gy}`}
            points={`${x},${y + TILE_H / 2} ${x + TILE_W / 2},${y} ${x + TILE_W},${y + TILE_H / 2} ${x + TILE_W / 2},${y + TILE_H}`}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />,
        );
      }
    }
    return (
      <Svg
        width={MAP_W * TILE_W}
        height={MAP_H * TILE_H}
        style={StyleSheet.absoluteFill}
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
        return (
          <Image
            key={b.id}
            source={b.src}
            resizeMode="contain"
            style={{
              position: 'absolute',
              width:  b.wPx,
              height: b.hPx,
              left:   x - b.wPx / 2,  // bottom-centre anchor
              top:    y - b.hPx,
            }}
          />
        );
      });

  /* render */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
