import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { colors } from '@/constants/theme';
import { trailEventCause, trailEventTitle } from '@/data/demo';
import type { MapPoint, TrailEventCategory, TrailEventSource } from '@/types/domain';

const MAP_WIDTH = 360;
const MAP_HEIGHT = 285;

export type ForestMapMarker = {
  id: string;
  point: MapPoint;
  source: TrailEventSource;
  category: TrailEventCategory;
  customTitle?: string;
  description: string;
};

const markerIcons: Record<
  TrailEventCategory,
  'close' | 'mountain' | 'tree' | 'shield' | 'help' | 'pin'
> = {
  blocked: 'close',
  washout: 'mountain',
  'fallen-tree': 'tree',
  closure: 'shield',
  'damaged-sign': 'help',
  other: 'pin',
};

function toViewBox(locationX: number, locationY: number, width: number, height: number) {
  if (!Number.isFinite(locationX) || !Number.isFinite(locationY) || width <= 0 || height <= 0) {
    return null;
  }
  const scale = Math.max(width / MAP_WIDTH, height / MAP_HEIGHT);
  const offsetX = (width - MAP_WIDTH * scale) / 2;
  const offsetY = (height - MAP_HEIGHT * scale) / 2;
  const x = (locationX - offsetX) / scale;
  const y = (locationY - offsetY) / scale;
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    y < 0 ||
    x > MAP_WIDTH ||
    y > MAP_HEIGHT
  ) {
    return null;
  }
  return { x: Math.round(x), y: Math.round(y) };
}

function toPixel(x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / MAP_WIDTH, height / MAP_HEIGHT);
  const offsetX = (width - MAP_WIDTH * scale) / 2;
  const offsetY = (height - MAP_HEIGHT * scale) / 2;
  return { x: offsetX + x * scale, y: offsetY + y * scale };
}

function MarkerGlyph({ name }: { name: (typeof markerIcons)[TrailEventCategory] }) {
  if (name === 'pin') {
    return (
      <>
        <Path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <Circle cx="12" cy="10" r="2" />
      </>
    );
  }
  if (name === 'help') {
    return (
      <>
        <Circle cx="12" cy="12" r="9" />
        <Path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2m0 3v.1" />
      </>
    );
  }
  const paths = {
    close: 'm6 6 12 12M6 18 18 6',
    mountain: 'm2 20 7-15 5 9 3-6 5 12H2Zm4-9 3 2 2-2',
    tree: 'M12 2 5 10h4l-5 7h6v5h4v-5h6l-5-7h4L12 2Z',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm0 5v5m0 3v.2',
  };
  return <Path d={paths[name]} />;
}

function EventMarker({ marker }: { marker: ForestMapMarker }) {
  const { x, y } = marker.point;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const color =
    marker.source === 'rescatista'
      ? colors.red
      : marker.source === 'local'
        ? colors.green
        : colors.amber;
  const badge = 13;
  const scale = 0.52;
  const offset = (badge * 2 - 24 * scale) / 2;
  return (
    <G>
      <Circle cx={x} cy={y} r={badge} fill="white" stroke={color} strokeWidth="2" />
      <G
        transform={`translate(${x - badge + offset} ${y - badge + offset}) scale(${scale})`}
        fill="none"
        stroke={color}
        strokeWidth={1.7 / scale}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <MarkerGlyph name={markerIcons[marker.category] ?? 'pin'} />
      </G>
    </G>
  );
}

export function ForestMap({
  compact = false,
  markers = [],
  selectedPoint = null,
  onPlace,
}: {
  compact?: boolean;
  markers?: ForestMapMarker[];
  selectedPoint?: Pick<MapPoint, 'x' | 'y'> | null;
  onPlace?: (point: Pick<MapPoint, 'x' | 'y'>) => void;
}) {
  const height = compact ? 200 : 285;
  const size = useRef({ width: 0, height });
  const [frame, setFrame] = useState({ width: 0, height });
  const [openId, setOpenId] = useState<string | null>(null);
  const openMarker = markers.find((marker) => marker.id === openId) ?? null;
  const eventLabel =
    markers.length === 0
      ? 'Mapa del bosque con senderos, puntos de control y ubicación.'
      : `Mapa del bosque con senderos, puntos de control, ubicación y ${markers.length} ${
          markers.length === 1 ? 'aviso' : 'avisos'
        }.`;
  const graphic = (
    <Svg
      width="100%"
      height={height}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
      aria-hidden={true}
    >
      <Rect width="360" height="285" fill="#E6EDDC" />
      <Path d="M0 45Q70 0 150 46T360 32V0H0Z" fill="#D2DFC5" />
      <Path d="M-20 250Q60 165 145 208T380 164V300H-20Z" fill="#CBDDBD" />
      <Path
        d="M-30 110Q55 30 124 94T275 85T390 130M-30 125Q55 45 124 109T275 100T390 145M-30 140Q55 60 124 124T275 115T390 160M-30 260Q70 160 150 220T390 190M-30 274Q70 174 150 234T390 204"
        fill="none"
        stroke="#BDCEB3"
        strokeWidth="1"
        opacity="0.7"
      />
      <Path
        d="M-10 168Q80 135 140 172T280 178T380 195"
        stroke="#A8CCD0"
        strokeWidth="13"
        fill="none"
      />
      <Path
        d="M35 270 100 215 170 155 140 85 100 20M170 155 245 115 335 70M170 155 255 260"
        stroke="#FAFAEF"
        strokeWidth="9"
        fill="none"
        strokeLinejoin="round"
      />
      <Path
        d="M35 270 100 215 170 155 140 85 100 20M170 155 245 115 335 70M170 155 255 260"
        stroke="#A48154"
        strokeWidth="3"
        strokeDasharray="7 5"
        fill="none"
      />
      <Path
        d="m250 45 57 12-6 48-65-4Z"
        stroke="#B9746F"
        fill="#EACEC3"
        fillOpacity="0.65"
        strokeDasharray="4 3"
      />
      {[
        [42, 83],
        [67, 65],
        [286, 217],
        [312, 235],
        [225, 30],
        [30, 226],
        [199, 72],
      ].map(([x, y], index) => (
        <Path key={index} d={`M${x} ${y - 10}l-7 13h5v5h4v-5h5Z`} fill="#7B9B77" opacity="0.65" />
      ))}
      <G fill={colors.forest} fontSize="9" fontWeight="600">
        <SvgText x="17" y="30" letterSpacing="2">
          LA PRIMAVERA
        </SvgText>
        <SvgText x="110" y="77">
          CP-03
        </SvgText>
        <SvgText x="255" y="132">
          CP-02
        </SvgText>
        <SvgText x="56" y="235">
          CP-01
        </SvgText>
        <SvgText x="238" y="79" fill="#964B49">
          Zona de riesgo
        </SvgText>
      </G>
      {[
        [140, 85],
        [245, 115],
        [100, 215],
      ].map(([x, y], index) => (
        <Rect
          key={index}
          x={x - 5}
          y={y - 5}
          width="10"
          height="10"
          rx="2"
          fill={colors.green}
          stroke="white"
          strokeWidth="2"
        />
      ))}
      <Circle cx="170" cy="155" r="24" fill="#628FA5" opacity="0.15" />
      <Circle cx="170" cy="155" r="9" fill={colors.blue} stroke="white" strokeWidth="3" />
      <Rect x="184" y="146" width="64" height="22" rx="7" fill="white" />
      <SvgText x="193" y="160" fontSize="9" fill={colors.ink}>
        Tú
      </SvgText>
      <Circle cx="331" cy="28" r="16" fill="#FFFFFF" opacity="0.9" />
      <Path d="m331 17-5 15 5-3 5 3Z" fill={colors.green} />
      {markers.map((marker) => (
        <EventMarker key={marker.id} marker={marker} />
      ))}
      {selectedPoint && Number.isFinite(selectedPoint.x) && Number.isFinite(selectedPoint.y) && (
        <>
          <Circle
            cx={selectedPoint.x}
            cy={selectedPoint.y}
            r="12"
            fill="none"
            stroke={colors.blue}
            strokeWidth="3"
          />
          <Circle cx={selectedPoint.x} cy={selectedPoint.y} r="4" fill={colors.blue} />
        </>
      )}
    </Svg>
  );

  return (
    <View
      style={styles.container}
      accessibilityRole={onPlace || markers.length > 0 ? undefined : 'image'}
      accessibilityLabel={onPlace || markers.length > 0 ? undefined : eventLabel}
    >
      <View
        style={{ height }}
        onLayout={(event) => {
          const { width, height: measured } = event.nativeEvent.layout;
          size.current = { width, height: measured };
          setFrame({ width, height: measured });
        }}
      >
        {onPlace ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Colocar el aviso en el mapa"
            onPress={(event) => {
              const native = event.nativeEvent;
              const node = event.currentTarget as unknown as {
                getBoundingClientRect?: () => {
                  left: number;
                  top: number;
                  width: number;
                  height: number;
                };
              };
              const rect = node.getBoundingClientRect?.();
              const scrollX =
                typeof window === 'undefined' || !Number.isFinite(window.scrollX)
                  ? 0
                  : window.scrollX;
              const scrollY =
                typeof window === 'undefined' || !Number.isFinite(window.scrollY)
                  ? 0
                  : window.scrollY;
              const locationX =
                rect && Number.isFinite(native.pageX) && Number.isFinite(rect.left)
                  ? native.pageX - rect.left - scrollX
                  : native.locationX;
              const locationY =
                rect && Number.isFinite(native.pageY) && Number.isFinite(rect.top)
                  ? native.pageY - rect.top - scrollY
                  : native.locationY;
              const point = toViewBox(
                locationX,
                locationY,
                rect?.width || size.current.width,
                rect?.height || size.current.height,
              );
              if (point) onPlace(point);
            }}
            style={{ height }}
          >
            {graphic}
          </Pressable>
        ) : (
          graphic
        )}
        {!onPlace && openMarker && (
          <Pressable
            accessibilityLabel="Cerrar aviso"
            onPress={() => setOpenId(null)}
            style={styles.dismiss}
          />
        )}
        {!onPlace &&
          markers.map((marker) => {
            const pixel = toPixel(marker.point.x, marker.point.y, frame.width, frame.height);
            const title = trailEventTitle(marker);
            return (
              <Pressable
                key={marker.id}
                accessibilityRole="button"
                accessibilityLabel={`Abrir aviso ${title}`}
                accessibilityState={{ selected: marker.id === openId }}
                onPress={() => setOpenId((current) => (current === marker.id ? null : marker.id))}
                style={[styles.hit, { left: pixel.x - 20, top: pixel.y - 20 }]}
              />
            );
          })}
        {!onPlace && openMarker && frame.width > 0 && (
          <MarkerBubble marker={openMarker} frame={frame} />
        )}
      </View>
      <View style={styles.legend}>
        <Text style={styles.caption}>— Sendero ▪ Control ● Ubicación</Text>
        <Text style={styles.caption}>El icono indica el tipo de aviso</Text>
      </View>
    </View>
  );
}

function MarkerBubble({
  marker,
  frame,
}: {
  marker: ForestMapMarker;
  frame: { width: number; height: number };
}) {
  const pixel = toPixel(marker.point.x, marker.point.y, frame.width, frame.height);
  const width = Math.min(220, Math.max(140, frame.width - 16));
  const left = Math.max(8, Math.min(pixel.x - width / 2, frame.width - width - 8));
  const above = pixel.y - 86;
  const top = above >= 8 ? above : pixel.y + 22;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${trailEventTitle(marker)}. ${trailEventCause(marker)}`}
      style={[styles.bubble, { left, top, width }]}
    >
      <Text style={styles.bubbleTitle}>{trailEventTitle(marker)}</Text>
      <Text style={styles.bubbleBody}>{trailEventCause(marker)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  legend: { backgroundColor: '#EEF2E8', padding: 12, gap: 5 },
  caption: { fontSize: 10, color: colors.muted, letterSpacing: 0.3 },
  dismiss: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 },
  hit: { position: 'absolute', width: 40, height: 40, zIndex: 2 },
  bubble: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleTitle: { fontSize: 13, lineHeight: 18, fontWeight: '700', color: colors.ink },
  bubbleBody: { fontSize: 12, lineHeight: 17, color: colors.muted },
});
