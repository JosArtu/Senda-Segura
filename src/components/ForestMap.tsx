import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { colors } from '@/constants/theme';

export function ForestMap({ compact = false }: { compact?: boolean }) {
  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel="Mapa ilustrativo: senderos, puntos de control y ubicación de ejemplo. No sirve para navegar."
    >
      <Svg
        width="100%"
        height={compact ? 200 : 285}
        viewBox="0 0 360 285"
        preserveAspectRatio="xMidYMid slice"
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
          Tú · ejemplo
        </SvgText>
        <Circle cx="331" cy="28" r="16" fill="#FFFFFF" opacity="0.9" />
        <Path d="m331 17-5 15 5-3 5 3Z" fill={colors.green} />
      </Svg>
      <View style={styles.legend}>
        <Text style={styles.caption}>— Sendero ▪ Control ● Ubicación</Text>
        <Text style={styles.caption}>Mapa ilustrativo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  legend: { backgroundColor: '#EEF2E8', padding: 12, gap: 5 },
  caption: { fontSize: 10, color: colors.muted, letterSpacing: 0.3 },
});
