import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { colors } from '@/constants/theme';

export type IconName =
  | 'tree'
  | 'map'
  | 'compass'
  | 'download'
  | 'user'
  | 'arrow'
  | 'back'
  | 'pin'
  | 'shield'
  | 'heart'
  | 'help'
  | 'check'
  | 'clock'
  | 'bluetooth'
  | 'phone'
  | 'mountain'
  | 'close';

export function Icon({
  name,
  size = 24,
  color = colors.green,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const paths: Partial<Record<IconName, string>> = {
    tree: 'M12 2 5 10h4l-5 7h6v5h4v-5h6l-5-7h4L12 2Z',
    map: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    back: 'M20 12H4m6-6-6 6 6 6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm0 5v5m0 3v.2',
    heart:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    check: 'm5 12 4 4L19 6',
    bluetooth: 'm7 6 10 12-5 4V2l5 4L7 18',
    phone: 'M7 3h10v18H7V3Zm3 14h4',
    mountain: 'm2 20 7-15 5 9 3-6 5 12H2Zm4-9 3 2 2-2',
    close: 'm6 6 12 12M6 18 18 6',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      {paths[name] && <Path d={paths[name]} />}
      {name === 'compass' && (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="m16 8-3 5-5 3 3-5 5-3Z" />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx="12" cy="7" r="4" />
          <Path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </>
      )}
      {name === 'pin' && (
        <>
          <Path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
          <Circle cx="12" cy="10" r="2" />
        </>
      )}
      {name === 'help' && (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2m0 3v.1" />
        </>
      )}
      {name === 'clock' && (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Polyline points="12,6 12,12 16,14" />
        </>
      )}
    </Svg>
  );
}
