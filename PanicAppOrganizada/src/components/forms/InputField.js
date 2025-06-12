/**
 * 📝 CAMPO DE INPUT REUTILIZABLE
 * ==============================
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/theme';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = null,
  icon = null,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences',
  style = {},
  inputStyle = {},
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = [
    styles.container,
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
    disabled && styles.inputContainerDisabled,
  ];

  const textInputStyle = [
    styles.input,
    multiline && styles.inputMultiline,
    inputStyle,
  ];

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...props}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lighter,
    borderRadius: spacing.inputRadius,
    paddingHorizontal: spacing.sm,
  },
  
  inputContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  
  inputContainerError: {
    borderColor: colors.danger,
  },
  
  inputContainerDisabled: {
    backgroundColor: colors.lighter,
    opacity: 0.6,
  },
  
  iconContainer: {
    marginRight: spacing.sm,
  },
  
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    fontFamily: typography.fonts.regular,
  },
  
  inputMultiline: {
    paddingVertical: spacing.md,
    textAlignVertical: 'top',
  },
  
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    marginTop: spacing.xs / 2,
    marginLeft: spacing.xs,
  },
  
  characterCount: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs / 2,
  },
});

export default InputField;
