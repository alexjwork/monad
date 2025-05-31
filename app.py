from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Simulated message storage (in production, use a proper database)
messages = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    message = data.get('message')
    sender = data.get('sender')
    if message and sender:
        messages.append({'sender': sender, 'message': message})
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Invalid data'})

@app.route('/get_messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(debug=True)
