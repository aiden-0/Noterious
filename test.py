from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI()

response = client.responses.create(
    model="gpt-4.1-mini",
    input="write a short motivational sentence."
)

print(response.output_text)