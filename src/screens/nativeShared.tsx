import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

export function Input({
  label,
  rightElement,
  ...props
}: { label: string; rightElement?: React.ReactNode } & TextInputProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, props.multiline && styles.multilineWrapper]}>
        <TextInput
          {...props}
          style={[styles.input, props.multiline && styles.multiline, props.style]}
          placeholderTextColor="#806F69"
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { color: '#1E1927', fontSize: 13, fontWeight: '800', marginBottom: 7 },
  inputWrapper: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    color: '#1E1927',
    fontSize: 15,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  rightElement: {
    marginLeft: 8,
  },
});
