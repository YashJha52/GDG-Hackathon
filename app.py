import os
import json
import random
import requests
import wikipedia
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# --- 1. INITIALIZATION & CONFIGURATION ---
load_dotenv()
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file.")
    genai.configure(api_key=api_key)
except (AttributeError, ValueError) as e:
    print(f"🔴 FATAL ERROR: {e}")
    exit()

app = Flask(__name__)
model = genai.GenerativeModel('gemini-1.5-flash-latest')
KHAN_ACADEMY_CACHE = None

# --- 2. HELPER FUNCTIONS FOR LEARNING TOOLS ---
def get_wikipedia_summary(topic: str) -> str:
    # (No changes to this function)
    try:
        return wikipedia.summary(topic, sentences=3, auto_suggest=True)
    except Exception as e:
        print(f"🟡 Wikipedia search failed: {e}")
        return "Could not retrieve a Wikipedia summary for this topic."

def get_khan_academy_topic(search_term: str) -> dict:
    """Fetches a single, relevant Khan Academy topic with a video thumbnail."""
    global KHAN_ACADEMY_CACHE
    if KHAN_ACADEMY_CACHE is None:
        try:
            response = requests.get("http://www.khanacademy.org/api/v1/topictree")
            response.raise_for_status()
            KHAN_ACADEMY_CACHE = response.json()
        except requests.RequestException: return None

    found_videos = []
    def find_videos(node):
        if node.get("kind") == "Video" and search_term.lower() in node.get("translated_title", "").lower():
            found_videos.append(node)
        for child in node.get("children", []):
            if len(found_videos) < 10: # Limit search for performance
                find_videos(child)

    find_videos(KHAN_ACADEMY_CACHE)
    
    if found_videos:
        # Pick a random video from the found list to vary the tasks
        video = random.choice(found_videos)
        return {
            "title": video["translated_title"],
            "image_url": f"https://img.youtube.com/vi/{video['youtube_id']}/hqdefault.jpg",
        }
    return None

# --- 3. DYNAMIC TASK GENERATION ENDPOINT ---
@app.route('/get-tasks')
def get_tasks():
    """Generates a set of tasks tailored to the user's grade."""
    try:
        grade = int(request.args.get('grade'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid grade provided."}), 400

    # Define grade-appropriate search terms for Khan Academy
    if 1 <= grade <= 3:
        math_topic_search = "early math"
    elif 4 <= grade <= 7:
        math_topic_search = "arithmetic"
    else:
        math_topic_search = "algebra basics"

    # Fetch a relevant Khan Academy topic
    math_topic_data = get_khan_academy_topic(math_topic_search)
    
    math_problem = "Could not generate a math problem."
    image_url = "https://placehold.co/600x400/e0c3fc/4a47a3?text=CareerQuest"

    if math_topic_data:
        image_url = math_topic_data['image_url']
        # Use Gemini to generate a math problem related to the topic
        try:
            prompt = f"Create one simple, age-appropriate math word problem for a grade {grade} student related to the topic of '{math_topic_data['title']}'. The problem should be a single paragraph."
            response = model.generate_content(prompt)
            math_problem = response.text
        except Exception as e:
            print(f"🔴 Math problem generation failed: {e}")

    # Assemble the final list of tasks for the frontend
    tasks = {
        "task1": {
            "title": "Task 1: The Logic Puzzle",
            "description": "A man is looking at a portrait... (full description)" # Omitted for brevity
        },
        "task2": {
            "title": "Task 2: The Creative Challenge",
            "description": "You have just invented a new mode of transportation... (full description)" # Omitted for brevity
        },
        "task3": {
            "title": "Task 3: The Visual Math Challenge",
            "image_url": image_url,
            "description": math_problem
        }
    }
    return jsonify(tasks)

# --- 4. CORE AI ANALYSIS LOGIC ---
@app.route('/analyze', methods=['POST'])
def analyze():
    # This function remains largely the same, but the prompt now understands "Task 3"
    task_data = request.get_json()
    # (Full analysis logic omitted for brevity, it's the same as the previous version
    # but with the prompt updated to recognize "The Visual Math Challenge")
    
    # ... previous career_analysis function logic here ...
    # This function is now called by the /analyze endpoint.
    # The only change is adding "The Visual Math Challenge" to the prompt's context.

    # Placeholder for the full function from previous step
    # For a complete file, paste the `career_analysis` function here.
    from the_previous_step import career_analysis # This is just a placeholder
    analysis_result = career_analysis(task_data)

    return jsonify(analysis_result)

# --- 5. FLASK SERVER ---
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)

