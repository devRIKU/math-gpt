from flask import Flask, request, jsonify
from flask_cors import CORS
from math_gpt_core import MathGPT
import sys
import os
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_api_key():
    try:
        # First try to get from environment variable (for Netlify)
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            print("Using API key from environment variable")
            return api_key
            
        # If not in environment, try to read from config file (for local development)
        config_path = os.path.join(os.path.dirname(__file__), 'config.txt')
        print(f"Looking for config file at: {config_path}")
        
        if not os.path.exists(config_path):
            print(f"Config file not found at: {config_path}")
            raise FileNotFoundError(f"config.txt not found at {config_path}")
            
        with open(config_path, 'r') as file:
            for line in file:
                if line.startswith('API_KEY='):
                    key = line.strip().split('=')[1]
                    print("Successfully read API key from config file")
                    return key
                    
        print("API_KEY not found in config file")
        raise ValueError("API_KEY not found in config.txt")
        
    except Exception as e:
        print(f"Error in get_api_key: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        raise

# Initialize MathGPT with API key
try:
    print("Attempting to initialize MathGPT...")
    api_key = get_api_key()
    print("API key retrieved successfully")
    math_gpt = MathGPT(api_key=api_key)
    print("MathGPT initialized successfully")
except Exception as e:
    print(f"Fatal error during initialization: {str(e)}")
    print("Full traceback:")
    traceback.print_exc()
    sys.exit(1)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        include_history = data.get('include_history', True)
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
            
        print(f"Processing prompt: {prompt[:50]}...")  # Log first 50 chars of prompt
        response = math_gpt.get_response(prompt, include_history)
        print("Response generated successfully")
        return jsonify({"response": response})
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/clear-history', methods=['POST'])
def clear_history():
    try:
        math_gpt.clear_history()
        return jsonify({"message": "Conversation history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        history = math_gpt.get_history()
        return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 