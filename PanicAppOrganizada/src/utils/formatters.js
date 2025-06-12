/**
 * 🎨 FORMATEADORES
 * ================
 */

export class Formatters {
  /**
   * 📱 Formatear número de teléfono
   */
  static formatPhone(phone) {
    if (!phone) return '';
    
    // Limpiar el número
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Agregar código de país si no lo tiene
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10 || cleanPhone.length === 7) {
        cleanPhone = '+57' + cleanPhone;
      }
    }
    
    return cleanPhone;
  }

  /**
   * 📍 Formatear coordenadas para mostrar
   */
  static formatCoordinates(latitude, longitude, precision = 6) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return 'Coordenadas no disponibles';
    }
    
    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
  }

  /**
   * 🕒 Formatear fecha y hora
   */
  static formatDateTime(date, options = {}) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota',
      ...options,
    };
    
    return dateObj.toLocaleString('es-CO', defaultOptions);
  }

  /**
   * ⏱️ Formatear duración en segundos
   */
  static formatDuration(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * 📏 Formatear distancia
   */
  static formatDistance(meters) {
    if (typeof meters !== 'number' || meters < 0) return 'N/A';
    
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)}km`;
  }

  /**
   * 🎯 Formatear precisión de ubicación
   */
  static formatAccuracy(accuracy) {
    if (typeof accuracy !== 'number' || accuracy < 0) return 'N/A';
    
    if (accuracy < 5) return '🎯 Excelente';
    if (accuracy < 10) return '✅ Muy buena';
    if (accuracy < 20) return '👍 Buena';
    if (accuracy < 50) return '⚠️ Regular';
    return '❌ Baja';
  }

  /**
   * 💾 Formatear tamaño de archivo
   */
  static formatFileSize(bytes) {
    if (typeof bytes !== 'number' || bytes < 0) return 'N/A';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  /**
   * 🔐 Formatear dirección de wallet (mostrar solo inicio y final)
   */
  static formatWalletAddress(address) {
    if (!address || address.length < 10) return address;
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  /**
   * 📊 Formatear porcentaje
   */
  static formatPercentage(value, total, decimals = 1) {
    if (typeof value !== 'number' || typeof total !== 'number' || total === 0) {
      return '0%';
    }
    
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
  }

  /**
   * 🎨 Formatear texto para URL (slug)
   */
  static formatSlug(text) {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export default Formatters;
