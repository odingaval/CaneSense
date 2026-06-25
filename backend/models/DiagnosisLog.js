const { driver } = require('../config/neo4j');

// In-memory mock data
let diagnosisLogs = [];

class DiagnosisLog {
  static async save(data) {
    const diagnosisId = `diag_${Math.random().toString(36).substr(2, 9)}`;
    const {
      field_id, cause, confidence, reasoning, recommendation, escalate
    } = data;

    if (driver) {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (field:Field {id: $fieldId})
           CREATE (d:Diagnosis {id: $diagnosisId, confidence: $confidence, 
             reasoning: $reasoning, recommendation: $recommendation, 
             escalate: $escalate, createdAt: datetime()})
           MERGE (causeNode:StressCause {type: $cause})
           CREATE (field)-[:HAS_DIAGNOSIS]->(d)
           CREATE (d)-[:CAUSED_BY]->(causeNode)
           SET field.status = CASE
             WHEN $escalate = true THEN 'urgent'
             WHEN $confidence = 'high' THEN 'caution'
             ELSE field.status
           END
           RETURN d`,
          { fieldId: field_id, diagnosisId, cause, confidence, reasoning, recommendation, escalate }
        );
        return { diagnosis_id: diagnosisId, ...data };
      } finally {
        await session.close();
      }
    } else {
      const logEntry = {
        diagnosis_id: diagnosisId,
        timestamp: new Date().toISOString(),
        ...data
      };
      diagnosisLogs.push(logEntry);
      return logEntry;
    }
  }

  static async findByFieldId(field_id) {
    if (driver) {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (f:Field {id: $fieldId})-[:HAS_DIAGNOSIS]->(d:Diagnosis)-[:CAUSED_BY]->(c:StressCause)
           RETURN d, c.type AS cause ORDER BY d.createdAt DESC LIMIT 1`,
          { fieldId: field_id }
        );
        if (result.records.length === 0) return null;
        const diag = result.records[0].get('d').properties;
        const cause = result.records[0].get('cause');
        return {
          ...diag,
          cause
        };
      } finally {
        await session.close();
      }
    } else {
      // Return most recent log for field
      const fieldLogs = diagnosisLogs.filter(log => log.field_id === field_id);
      return fieldLogs.length ? fieldLogs[fieldLogs.length - 1] : null;
    }
  }
}

module.exports = DiagnosisLog;
