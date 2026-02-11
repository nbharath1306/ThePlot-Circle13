# API Documentation
## ThePlot Backend API Reference

---

## Base URL
- **Development:** `http://localhost:3000/api`
- **Production:** `https://theplot.app/api`

---

## Authentication
No authentication required for MVP. All endpoints are public but rate-limited.

**Rate Limits:**
- 10 requests per minute per IP
- 5 simulations per day per IP

---

## Endpoints

### 1. Create Session

**Endpoint:** `POST /api/session/create`

**Description:** Creates a new simulation session and generates QR code for second user.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "qrCodeUrl": "https://theplot.app/session/550e8400-e29b-41d4-a716-446655440000",
  "qrCodeDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
  "expiresAt": 1676392200000
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Failed to create session",
  "code": "SESSION_CREATE_FAILED"
}
```

**Status Codes:**
- `200` - Success
- `429` - Rate limit exceeded
- `500` - Server error

---

### 2. Join Session

**Endpoint:** `POST /api/session/join`

**Description:** Second user joins existing session.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user_b_abc123def456"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "users": {
      "userA": { "userId": "user_a_xyz789", "connected": true },
      "userB": { "userId": "user_b_abc123", "connected": true }
    },
    "expiresAt": 1676392200000
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Session not found",
  "code": "SESSION_NOT_FOUND"
}
```

```json
{
  "success": false,
  "error": "Session already full",
  "code": "SESSION_FULL"
}
```

**Status Codes:**
- `200` - Success
- `404` - Session not found
- `409` - Session already full
- `410` - Session expired
- `429` - Rate limit exceeded

---

### 3. Submit Answers

**Endpoint:** `POST /api/session/answer`

**Description:** User submits their question answers.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user_a_xyz789",
  "answers": [
    {
      "questionId": "q1",
      "value": "Talk it out",
      "timestamp": 1676390400000
    },
    {
      "questionId": "q2",
      "value": "Trust",
      "timestamp": 1676390405000
    },
    {
      "questionId": "q3",
      "value": "Be hurt but talk about it",
      "timestamp": 1676390410000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "bothUsersReady": true,
  "message": "Answers submitted. Starting simulation..."
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Invalid answer format",
  "code": "VALIDATION_ERROR",
  "details": [
    "answers must contain exactly 3 items",
    "questionId must match pattern /^q[1-3]$/",
    "value must be 1-200 characters"
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `404` - Session not found
- `429` - Rate limit exceeded

---

### 4. Run Simulation

**Endpoint:** `POST /api/simulate`

**Description:** Triggers AI simulation (auto-called when both users ready).

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userAData": {
    "userId": "user_a_xyz789",
    "answers": [
      { "questionId": "q1", "value": "Talk it out" },
      { "questionId": "q2", "value": "Trust" },
      { "questionId": "q3", "value": "Be hurt but talk about it" }
    ]
  },
  "userBData": {
    "userId": "user_b_abc123",
    "answers": [
      { "questionId": "q1", "value": "Need alone time" },
      { "questionId": "q2", "value": "Growth" },
      { "questionId": "q3", "value": "Stay calm" }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "simulation": {
    "timeline": [
      {
        "year": 1,
        "events": [
          "First vacation together in Bali",
          "User A meets User B's family",
          "Both start new jobs in same city"
        ],
        "emotionalShift": {
          "trust": 15,
          "satisfaction": 20,
          "commitment": 25
        }
      },
      {
        "year": 2,
        "events": [
          "User A promoted to manager",
          "Move in together",
          "Adopt a dog named Charlie"
        ],
        "emotionalShift": {
          "trust": 10,
          "satisfaction": 15,
          "commitment": 20
        }
      },
      // ... years 3-7
    ],
    "outcome": "success_thriving",
    "outcomeName": "Thriving: Best Friends & Partners",
    "insights": [
      "Strong foundation in trust and communication",
      "Both value personal growth which strengthens bond",
      "Complementary conflict styles (one talks, one reflects) work well together"
    ],
    "emotionalMetrics": [
      { "year": 1, "trust": 65, "satisfaction": 70, "commitment": 75 },
      { "year": 2, "trust": 75, "satisfaction": 85, "commitment": 95 },
      // ... years 3-7
    ]
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "AI service unavailable",
  "code": "AI_SERVICE_ERROR"
}
```

**Status Codes:**
- `200` - Success
- `404` - Session not found
- `500` - AI service error
- `503` - Service temporarily unavailable

---

## Data Models

### Session
```typescript
interface Session {
  id: string;                    // UUID
  created_at: number;            // Unix timestamp
  expires_at: number;            // Unix timestamp
  status: SessionStatus;
  users: {
    userA: UserData | null;
    userB: UserData | null;
  };
  simulation?: SimulationResult;
}

type SessionStatus = 'waiting' | 'active' | 'completed' | 'expired';
```

### UserData
```typescript
interface UserData {
  userId: string;                // Format: user_[ab]_[16 random chars]
  answers: Answer[];
  connected: boolean;
  lastSeen: number;              // Unix timestamp
}
```

### Answer
```typescript
interface Answer {
  questionId: string;            // q1, q2, or q3
  value: string;                 // User's answer
  timestamp: number;             // When answered
}
```

### SimulationResult
```typescript
interface SimulationResult {
  timeline: YearEvent[];
  outcome: OutcomeType;
  outcomeName: string;
  insights: string[];
  emotionalMetrics: EmotionalState[];
}
```

### YearEvent
```typescript
interface YearEvent {
  year: number;                  // 1-7
  events: string[];              // 3-5 events
  emotionalShift: {
    trust: number;               // -50 to +50
    satisfaction: number;
    commitment: number;
  };
}
```

### OutcomeType
```typescript
type OutcomeType =
  | 'success_strong'             // Still Together: Strong Foundation
  | 'success_engaged'            // Engaged: Ready for Next Chapter
  | 'success_thriving'           // Thriving: Best Friends & Partners
  | 'success_growing'            // Growing Together: Communication Masters
  | 'challenge_break'            // Taking a Break: Reassessing Priorities
  | 'challenge_different_paths'  // Friendly Separation: Different Paths
  | 'challenge_timing';          // On Pause: Timing Wasn't Right
```

### EmotionalState
```typescript
interface EmotionalState {
  year: number;
  trust: number;                 // 0-100
  satisfaction: number;          // 0-100
  commitment: number;            // 0-100
}
```

---

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `SESSION_NOT_FOUND` | Session ID doesn't exist | 404 |
| `SESSION_EXPIRED` | Session past expiration time | 410 |
| `SESSION_FULL` | Both users already connected | 409 |
| `SESSION_CREATE_FAILED` | Failed to create session | 500 |
| `VALIDATION_ERROR` | Request body validation failed | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `AI_SERVICE_ERROR` | Claude API error | 500 |
| `REALTIME_ERROR` | Supabase realtime error | 500 |
| `UNKNOWN_ERROR` | Unexpected error | 500 |

---

## Rate Limiting

**Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1676390460
```

**429 Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 45 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 45
}
```

---

## Webhooks (Future)

Not implemented in MVP. Planned for Phase 2.

**Potential Events:**
- `simulation.completed`
- `session.expired`
- `user.disconnected`

---

## SDK Usage Examples

### JavaScript/TypeScript
```typescript
// Create session
const response = await fetch('/api/session/create', {
  method: 'POST',
});
const { sessionId, qrCodeDataUrl } = await response.json();

// Join session
await fetch('/api/session/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    userId: 'user_b_randomid123',
  }),
});

// Submit answers
await fetch('/api/session/answer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    userId: 'user_a_randomid456',
    answers: [
      { questionId: 'q1', value: 'Talk it out', timestamp: Date.now() },
      { questionId: 'q2', value: 'Trust', timestamp: Date.now() },
      { questionId: 'q3', value: 'Be hurt but talk about it', timestamp: Date.now() },
    ],
  }),
});
```

### Python
```python
import requests

# Create session
response = requests.post('https://theplot.app/api/session/create')
data = response.json()
session_id = data['sessionId']

# Join session
requests.post('https://theplot.app/api/session/join', json={
    'sessionId': session_id,
    'userId': 'user_b_randomid123'
})

# Submit answers
requests.post('https://theplot.app/api/session/answer', json={
    'sessionId': session_id,
    'userId': 'user_a_randomid456',
    'answers': [
        {'questionId': 'q1', 'value': 'Talk it out', 'timestamp': int(time.time() * 1000)},
        {'questionId': 'q2', 'value': 'Trust', 'timestamp': int(time.time() * 1000)},
        {'questionId': 'q3', 'value': 'Be hurt but talk about it', 'timestamp': int(time.time() * 1000)}
    ]
})
```

---

## Testing

**Postman Collection:** [Download](./theplot-api.postman.json)

**Example Test Flow:**
```bash
# 1. Create session
curl -X POST http://localhost:3000/api/session/create

# 2. Join session (use sessionId from step 1)
curl -X POST http://localhost:3000/api/session/join \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "YOUR_SESSION_ID", "userId": "user_b_test123"}'

# 3. Submit answers for User A
curl -X POST http://localhost:3000/api/session/answer \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "YOUR_SESSION_ID", "userId": "user_a_test456", "answers": [...]}'

# 4. Submit answers for User B (triggers simulation)
curl -X POST http://localhost:3000/api/session/answer \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "YOUR_SESSION_ID", "userId": "user_b_test123", "answers": [...]}'
```

---

**Document End**
