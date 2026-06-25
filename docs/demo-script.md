# Canesense Demo Script

1. **Open the app**
   - Show the demo field with status "caution" (amber badge).

2. **Click "Report a problem"**
   - Enter: 20 weeks
   - Symptom: "Leaves yellowing from the tip, lower side of the field"
   - Location: "Lower section"
   - Recent rain: No

3. **Submit**
   - Show the loading state ("Checking your field...").

4. **Show the result**
   - Likely cause: **Water stress**
   - Confidence: High (78%)
   - Reasoning: Clear explanation combining rain gap and satellite data.
   - Recommended action: "Irrigate the lower third of the field this week if possible."
   - Estimated cost saving: "Skipping fertilizer this round saves approximately KES 1,500."

5. **Second submission (Escalation)**
   - Click "Check another field"
   - Enter: "holes in leaves", Location: "whole field", Recent rain: Yes
   - Result should trigger low confidence and an escalation warning.

6. **SMS summary**
   - Scroll to the bottom of the result screen to show the SMS fallback message in a grey bubble.
