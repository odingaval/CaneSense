class RainfallService {
  static async getFieldRainfall(field_id) {
    // Mock rainfall data
    return { 
      gapDays: 16, 
      lastRainDate: "2025-06-06" 
    };
  }
}

module.exports = RainfallService;
