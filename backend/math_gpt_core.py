import google.generativeai as genai
from google.generativeai import types
import os
import traceback
import time
from google.api_core import retry

class MathGPT:
    def __init__(self, api_key=None):
        if not api_key:
            raise ValueError("API key is required. Please provide your Gemini API key.")
        
        try:
            print(f"Initializing MathGPT with API key: {api_key[:5]}...")  # Only show first 5 chars
            self.api_key = api_key
            genai.configure(api_key=self.api_key)
            
            # List available models
            print("Available models:")
            for m in genai.list_models():
                print(f"- {m.name}")
            
            self.conversation_history = []
            # Use gemini-2.0-flash which has higher quotas
            self.model = genai.GenerativeModel('models/gemini-2.0-flash')
            print("Successfully initialized Gemini model")
        except Exception as e:
            print(f"Error initializing MathGPT: {str(e)}")
            print("Full traceback:")
            traceback.print_exc()
            raise

    @retry.Retry(
        predicate=retry.if_exception_type(Exception),
        initial=1.0,
        maximum=32.0,
        multiplier=2.0,
        deadline=300.0
    )
    def get_response(self, prompt, include_history=True):
        try:
            if not prompt:
                return "Please provide a question or prompt."

            print(f"Processing prompt: {prompt[:50]}...")  # Log first 50 chars
            # Prepare conversation context if history is enabled
            contents = []
            if include_history and self.conversation_history:
                # Limit history to last 3 messages to reduce token usage
                for msg in self.conversation_history[-3:]:
                    contents.append(msg)
            contents.append(prompt)

            print("Generating response...")
            response = self.model.generate_content(
                contents,
                generation_config=types.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=500,  # Reduced token limit
                )
            )

            if not response.text:
                print("No response text received from model")
                return "I apologize, but I couldn't generate a response. Please try again."

            print("Response generated successfully")
            # Update conversation history
            if include_history:
                self.conversation_history.append(prompt)
                self.conversation_history.append(response.text)

            return response.text
        except Exception as e:
            error_msg = str(e)
            print(f"Error in get_response: {error_msg}")
            print("Full traceback:")
            traceback.print_exc()
            
            # Handle rate limit errors specifically
            if "429" in error_msg:
                retry_after = 32  # Default retry time
                if "retry_delay" in error_msg:
                    try:
                        # Try to extract retry delay from error message
                        retry_after = int(error_msg.split('retry_delay { seconds: ')[1].split(' }')[0])
                    except:
                        pass
                print(f"Rate limit hit. Waiting {retry_after} seconds before retrying...")
                time.sleep(retry_after)
                return "I'm currently processing a lot of requests. Please try again in a moment."
            
            return f"I encountered an error while processing your request: {error_msg}"

    def clear_history(self):
        """Clear the conversation history"""
        self.conversation_history = []

    def get_history(self):
        """Get the current conversation history"""
        return self.conversation_history.copy() 