"""
PassKey API Research Notes
-------------------------

Current Flow Analysis (2025):
1. Initial Authentication
   - Entry point: https://book.passkey.com/entry?token={JWT_TOKEN}
   - Token format: JWT containing encrypted payload
   - Required headers: 
     * User-Agent
     * Accept
     * XSRF-TOKEN (cookie)

2. Session Establishment
   - Cookies required:
     * JSESSIONID
     * XSRF-TOKEN
     * AWSALB/AWSALBCORS (AWS load balancer)
     * QueueITAccepted (queue bypass)

3. Room Search
   - Endpoint: /event/{eventId}/owner/{ownerId}/rooms/select
   - Method: POST
   - Required data:
     * _csrf: {XSRF-TOKEN value}
     * hotelId: '0'
     * blockMap.blocks[0].blockId: '0'
     * blockMap.blocks[0].checkIn: 'YYYY-MM-DD'
     * blockMap.blocks[0].checkOut: 'YYYY-MM-DD'
     * blockMap.blocks[0].numberOfGuests: {int}
     * blockMap.blocks[0].numberOfRooms: {int}
     * blockMap.blocks[0].numberOfChildren: {int}

4. Room Selection Flow (Current GenCon Implementation):
   - Initial selection endpoint: /list/hotels
   - Returns JSON with:
     * hotel['id']
     * hotel['name'] 
     * hotel['distanceFromEvent']
     * hotel['distanceUnit']
     * block['blockId']
     * block['name']
     * block['inventory'][]['rate']
     * block['inventory'][]['available']

Note: The JSON payload you shared appears to be from Cvent's general API, not the specific PassKey implementation used by GenCon. The GenCon implementation uses a simpler payload structure focused on room selection and basic guest counts.

Known Security Measures:
- CSRF protection via token
- Queue-IT integration for traffic management
- Session validation
- AWS WAF/Shield likely present
- Rate limiting on search and selection endpoints

Next Steps:
1. Document the actual reservation submission endpoint
2. Verify required fields for room selection
3. Map the payment flow
4. Test session timeout behavior
""" 