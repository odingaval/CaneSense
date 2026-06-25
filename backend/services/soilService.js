class SoilService {
  static async getFieldSoilData(field_id) {
    // Mock soil data
    return { 
      nitrogen: "adequate", 
      phosphorus: "low", 
      ph: 6.1 
    };
  }
}

module.exports = SoilService;
