# Virtual Therapist Server Application

## Overview

This Virtual Therapist Server Application provides an interface for interacting with a virtual assistant named "Mable", designed to simulate a therapeutic conversation. Utilizing OpenAI's GPT-3.5 model, the application offers empathetic and supportive responses, aiming to understand and help users through conversation. The server is built with Express.js and leverages the OpenAI API for generating responses.

## Installation

Before you can run the server, ensure you have Node.js installed on your system. Then, follow these steps to get the server up and running:

1. **Clone the Repository** git clone <repository-url> cd <repository-directory>

2. **Install Dependencies** npm install

3. **Set Up Environment Variables** Create a `.env` file in the root directory of your project. Add the following variables: PORT=<your_preferred_port> OPENAI_API_KEY=<your_openai_api_key> API_KEY=<your_api_key_for_authentication>

4. **Start the Server** npm start or npm run dev

## Usage

The server provides a `/chat` POST endpoint for initiating conversation with the virtual therapist "Mable". It expects an API key for authentication and uses a session-based approach to maintain the context of the conversation.

### Making a Request

To interact with the virtual therapist, send a POST request to `/chat` with a valid API key and the following JSON payload:

```json
{
"sessionId": "unique_session_id",
"userMessage": "Your message here"
}

sessionId is a unique identifier for your conversation session.
userMessage is the message you want to send to the virtual therapist.
Ensure to include your API key in the request headers under x-api-key.

Response
The server responds with a JSON object containing the reply from the virtual therapist:
{
  "reply": "Therapist's response here"
}

API Endpoint
POST /chat
Headers:
Content-Type: application/json
x-api-key: <your_api_key>
Body:

{
  "sessionId": "unique_session_id",
  "userMessage": "Your message here"
}

Success Response:
Code: 200 OK
Content: { "reply": "Therapist's response here" }
Error Responses:
Code: 400 Bad Request (Invalid input data)
Code: 401 Unauthorized (Invalid or missing API key)
Code: 500 Internal Server Error (Server or API failure)
```
