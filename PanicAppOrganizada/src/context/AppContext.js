/**
 * 🌍 CONTEXTO GLOBAL DE LA APLICACIÓN
 * ===================================
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import StorageService from '../services/StorageService';

// Estado inicial
const initialState = {
  user: {
    name: '',
    hasSeenWelcome: false,
  },
  app: {
    isLoading: true,
    isInitialized: false,
    error: null,
  },
  settings: {
    enableNotifications: true,
    enableVibration: true,
    enableSound: true,
    theme: 'light',
  },
};

// Tipos de acciones
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_ERROR: 'SET_ERROR',
  INITIALIZE_APP: 'INITIALIZE_APP',
  RESET_APP: 'RESET_APP',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        app: {
          ...state.app,
          isLoading: action.payload,
        },
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case ActionTypes.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          error: action.payload,
        },
      };

    case ActionTypes.INITIALIZE_APP:
      return {
        ...state,
        ...action.payload,
        app: {
          ...state.app,
          isInitialized: true,
          isLoading: false,
        },
      };

    case ActionTypes.RESET_APP:
      return {
        ...initialState,
        app: {
          ...initialState.app,
          isInitialized: true,
          isLoading: false,
        },
      };

    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext();

// Provider del contexto
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Inicializar aplicación
  const initializeApp = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      // Cargar datos del storage
      const initData = await StorageService.initialize();
      const settings = await StorageService.getSettings();

      // Actualizar estado
      dispatch({
        type: ActionTypes.INITIALIZE_APP,
        payload: {
          user: {
            name: initData.userName,
            hasSeenWelcome: initData.hasSeenWelcome,
          },
          settings,
        },
      });

    } catch (error) {
      console.error('Error initializing app:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message,
      });
    }
  };

  // Actualizar usuario
  const updateUser = async (userData) => {
    try {
      if (userData.name) {
        await StorageService.saveUserName(userData.name);
      }

      dispatch({
        type: ActionTypes.SET_USER,
        payload: userData,
      });

    } catch (error) {
      console.error('Error updating user:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message,
      });
    }
  };

  // Actualizar configuraciones
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...state.settings, ...newSettings };
      await StorageService.saveSettings(updatedSettings);

      dispatch({
        type: ActionTypes.SET_SETTINGS,
        payload: newSettings,
      });

    } catch (error) {
      console.error('Error updating settings:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message,
      });
    }
  };

  // Limpiar datos de la app
  const resetApp = async () => {
    try {
      await StorageService.clear();
      dispatch({ type: ActionTypes.RESET_APP });
    } catch (error) {
      console.error('Error resetting app:', error);
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.message,
      });
    }
  };

  // Limpiar error
  const clearError = () => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: null,
    });
  };

  // Inicializar al montar
  useEffect(() => {
    initializeApp();
  }, []);

  const value = {
    // Estado
    ...state,
    
    // Acciones
    updateUser,
    updateSettings,
    resetApp,
    clearError,
    initializeApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;
