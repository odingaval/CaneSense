const API_BASE = '/api';

export const apiClient = {
  async getField(fieldId) {
    const response = await fetch(`${API_BASE}/fields/${fieldId}`);
    if (!response.ok) throw new Error('Failed to fetch field');
    return response.json();
  },

  async diagnose(data) {
    const response = await fetch(`${API_BASE}/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Diagnosis failed');
    return response.json();
  }
};
