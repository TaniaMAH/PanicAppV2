/**
 * 🧭 NAVEGADOR PRINCIPAL DE LA APLICACIÓN
 * =======================================
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, Alert } from 'react-native';
import StorageService from '../services/StorageService';

// Importar pantallas
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ContactsScreen from '../screens/main/ContactsScreen';
import LocationScreen from '../screens/emergency/LocationScreen';
import RealTimeLocationScreen from '../screens/emergency/RealTimeLocationScreen';
import AlertScreen from '../screens/emergency/AlertScreen';
import WalletScreen from '../screens/settings/WalletScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar storage y verificar estado
      const initData = await StorageService.initialize();
      
      // Determinar ruta inicial basada en onboarding
      if (initData.isFirstTime) {
        setInitialRoute('Welcome');
      } else {
        setInitialRoute('Home');
      }

      // Verificar permisos en iOS
      if (Platform.OS === 'ios') {
        checkiOSPermissions();
      }

    } catch (error) {
      console.error('Error inicializando app:', error);
      setInitialRoute('Welcome');
    } finally {
      setIsReady(true);
    }
  };

  const checkiOSPermissions = () => {
    // Información sobre permisos en iOS
    setTimeout(() => {
      Alert.alert(
        'Permisos importantes',
        'Para que la app funcione correctamente, asegúrate de permitir:\n\n• Ubicación (Siempre)\n• Notificaciones\n\nPuedes cambiar esto en Configuración > PanicApp',
        [{ text: 'Entendido' }]
      );
    }, 2000);
  };

  if (!isReady) {
    return null; // Aquí podrías mostrar un splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false, // Usamos nuestros headers personalizados
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Pantallas de autenticación */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ 
            gestureEnabled: false, // No permitir swipe back en welcome
          }}
        />

        {/* Pantallas principales */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            gestureEnabled: false, // No permitir swipe back en home
          }}
        />
        
        <Stack.Screen 
          name="Contacts" 
          component={ContactsScreen}
        />

        {/* Pantallas de emergencia */}
        <Stack.Screen 
          name="Location" 
          component={LocationScreen}
        />
        
        <Stack.Screen 
          name="RealTimeLocation" 
          component={RealTimeLocationScreen}
        />
        
        <Stack.Screen 
          name="Alert" 
          component={AlertScreen}
          options={{ 
            gestureEnabled: false, // No permitir swipe back durante alerta
            animation: 'fade', // Animación más dramática para emergencia
          }}
        />

        {/* Pantallas de configuración */}
        <Stack.Screen 
          name="Wallet" 
          component={WalletScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;