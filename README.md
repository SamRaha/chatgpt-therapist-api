API Documentation Base URL The base URL for the API is dependent on the environment it's deployed in. For development, it typically is http://localhost:3000.

Authentication All API requests require a valid API key provided in the request header:

Header Name: x-api-key Value: "91ff0343-001a-4abd-a7cf-ad818430d5c0"

1. Create a New Device URL: /devices Method: POST Auth Required: Yes Body: json Copy code { "name": "string", "address": "string", "longitude": "number", "latitude": "number", "device_type": "node | luminaire", "manufacturer": "string", "model": "string", "install_date": "string", "notes": "string", "eui": "string", "serial_number": "string" } Success Response: Code: 201 Created Content: json Copy code { "id": "uuid", "name": "string", "address": "string", ... } Error Response: Code: 400 Bad Request Content: { "errors": [{"index": 0, "error": "Error details"}], "createdDevices": [] }
2. Read All Devices URL: /devices Method: GET Auth Required: Yes Success Response: Code: 200 OK Content: [{"id": "uuid", "name": "string", ...}, ...]
3. Read a Single Device by ID URL: /devices/:id

Method: GET

Auth Required: Yes

URL Params: id=[uuid]

Success Response:

Code: 200 OK Content: {"id": "uuid", "name": "string", ...} Error Response:

Code: 404 Not Found Content: "Device not found" 4. Update a Device URL: /devices/:id Method: PUT Auth Required: Yes URL Params: id=[uuid] Body: json Copy code { "name": "string", ... } Success Response:

Code: 200 OK Content: {"id": "uuid", "name": "string", ...} Error Response:

Code: 400 Bad Request / 404 Not Found Content: "Error message" 5. Delete a Device URL: /devices/:id

Method: DELETE

Auth Required: Yes

URL Params: id=[uuid]

Success Response:

Code: 204 No Content Error Response:

Code: 404 Not Found Content: "Device not found"
