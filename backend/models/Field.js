const { driver } = require('../config/neo4j');

// In-memory mock data
let fields = [
  {
    field_id: "fld_demo",
    farmer_id: "f_001",
    name: "Demo plot — Kakamega",
    lat: 0.2827,
    lng: 34.7519,
    status: "caution",
    last_checked: "2025-06-20"
  }
];

class Field {
  static async create({ farmer_id, name, lat, lng }) {
    const fieldId = `fld_${Math.random().toString(36).substr(2, 9)}`;
    
    if (driver) {
      const session = driver.session();
      try {
        const result = await session.run(
          `MERGE (farmer:Farmer {id: $farmerId})
           CREATE (field:Field {id: $fieldId, name: $name, lat: $lat, lng: $lng, 
             status: 'healthy', createdAt: datetime()})
           CREATE (farmer)-[:OWNS]->(field)
           RETURN field`,
          { farmerId: farmer_id, fieldId, name, lat, lng }
        );
        const record = result.records[0].get('field').properties;
        return {
          field_id: record.id,
          name: record.name,
          lat: record.lat,
          lng: record.lng,
          status: record.status,
          last_checked: null
        };
      } finally {
        await session.close();
      }
    } else {
      const newField = {
        field_id: fieldId,
        farmer_id,
        name,
        lat,
        lng,
        status: "healthy",
        last_checked: null
      };
      fields.push(newField);
      return newField;
    }
  }

  static async findById(field_id) {
    if (driver) {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (f:Field {id: $fieldId}) RETURN f`,
          { fieldId: field_id }
        );
        if (result.records.length === 0) return null;
        const props = result.records[0].get('f').properties;
        return {
          field_id: props.id,
          name: props.name,
          lat: props.lat,
          lng: props.lng,
          status: props.status,
          last_checked: props.last_checked || null
        };
      } finally {
        await session.close();
      }
    } else {
      return fields.find(f => f.field_id === field_id) || null;
    }
  }

  static async updateStatus(field_id, status) {
    if (driver) {
      const session = driver.session();
      try {
        await session.run(
          `MATCH (f:Field {id: $fieldId}) SET f.status = $status RETURN f`,
          { fieldId: field_id, status }
        );
      } finally {
        await session.close();
      }
    } else {
      const field = fields.find(f => f.field_id === field_id);
      if (field) {
        field.status = status;
        field.last_checked = new Date().toISOString().split('T')[0];
      }
    }
  }
}

module.exports = Field;
