class SatelliteService {
  static async getFieldSignals(field_id) {
    // Mock satellite data
    return { 
      trend: "declining", 
      ndvi_value: 0.42 
    };
  }
}

module.exports = SatelliteService;
