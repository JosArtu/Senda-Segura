import { Switch, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, shared } from '@/constants/theme';
import { permissionOptions } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';

export function PermissionControls() {
  const { permissions, togglePermission } = useDemoSession();
  return (
    <View style={shared.stack}>
      <Text accessibilityRole="header" style={shared.heading}>
        Preferencias de conexión
      </Text>
      {permissionOptions.map((permission) => (
        <View key={permission.id} style={[shared.card, shared.row, { padding: 16 }]}>
          <Icon name={permission.icon} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={shared.label}>{permission.title}</Text>
            <Text style={[shared.body, { fontSize: 12, lineHeight: 18 }]}>
              {permission.description}
            </Text>
          </View>
          <Switch
            accessibilityLabel={permission.title}
            value={permissions[permission.id]}
            onValueChange={() => togglePermission(permission.id)}
            trackColor={{ false: colors.border, true: colors.green }}
            thumbColor={colors.white}
          />
        </View>
      ))}
    </View>
  );
}
