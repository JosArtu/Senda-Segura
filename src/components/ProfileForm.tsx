import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button, Notice } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { useDemoSession } from '@/hooks/useDemoSession';

export function ProfileForm({
  onSaved,
  submitLabel,
}: {
  onSaved?: () => void;
  submitLabel: string;
}) {
  const { profile, setProfile } = useDemoSession();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const save = () => {
    if (
      !name.trim() ||
      !/^[+\d\s()-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 10 ||
      phone.replace(/\D/g, '').length > 15
    ) {
      setMessage('Escribe un nombre y un teléfono de 10 a 15 dígitos.');
      setError(true);
      return;
    }
    setProfile({ name: name.trim(), phone: phone.trim() });
    setMessage('Perfil actualizado para esta sesión.');
    setError(false);
    onSaved?.();
  };

  return (
    <View style={shared.stack}>
      <View style={{ gap: 8 }}>
        <Text style={shared.label}>Nombre</Text>
        <TextInput
          accessibilityLabel="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          maxLength={80}
          style={shared.input}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={shared.label}>Teléfono celular</Text>
        <TextInput
          accessibilityLabel="Teléfono celular"
          value={phone}
          onChangeText={setPhone}
          placeholder="000 000 0000"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          maxLength={24}
          style={shared.input}
        />
      </View>
      {message !== '' && (
        <View accessibilityLiveRegion="polite">
          <Notice warning={error}>{message}</Notice>
        </View>
      )}
      <Button label={submitLabel} icon="check" onPress={save} />
      <Text style={[shared.body, { fontSize: 12 }]}>
        Tu nombre y teléfono se incluirán en los datos de tu solicitud.
      </Text>
    </View>
  );
}
