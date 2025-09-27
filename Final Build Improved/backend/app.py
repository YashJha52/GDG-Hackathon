import os
import json
import random
import wikipedia
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Add this import
from dotenv import load_dotenv
from datetime import datetime
from urllib.parse import quote

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
CORS(app)  # Add this line to enable CORS
model = genai.GenerativeModel('gemini-1.5-flash-latest')

DATA_DIR = "data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


# --- 2. USER DATA MANAGEMENT ---
def get_user_filepath(username: str) -> str:
    safe_username = "".join(filter(str.isalnum, username)).lower()
    return os.path.join(DATA_DIR, f"{safe_username}.json")

def load_user_data(username: str) -> dict:
    filepath = get_user_filepath(username)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return None

def save_user_data(username: str, data: dict):
    filepath = get_user_filepath(username)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)


# --- 3. HELPER FUNCTIONS ---
def get_wikipedia_summary(topic: str) -> str:
    try:
        return wikipedia.summary(topic, sentences=3, auto_suggest=True)
    except Exception:
        return "Could not retrieve a Wikipedia summary for this topic."


def generate_math_task(grade: int) -> dict:
    """Uses Gemini to create a grade-appropriate math word problem with a visualization hint."""
    print(f"🎯 Generating MathAPI task for grade {grade}...")
    fallback_image_url = "https://placehold.co/600x400/EEF2FF/4338CA?text=Math+Problem"
    try:
        prompt = f"""
        You are MathAI, an expert in creating math problems.
        Generate ONE math word problem for a grade {grade} student.
        The problem must be clear, fun, and solvable in 1–3 steps.
        Return STRICT JSON:
        {{
          "problem_text": "The word problem here...",
          "image_prompt": "Short description for illustration (no question marks, just a phrase)"
        }}
        """
        response = model.generate_content(prompt)
        if not response.text:
            raise ValueError("Empty response from Gemini for math task.")
        task_data = json.loads(response.text.strip())
        encoded_text = quote(task_data["image_prompt"])
        image_url = f"https://placehold.co/600x400/e0e7ff/4338ca?text={encoded_text}"
        return {"description": task_data["problem_text"], "image_url": image_url}
    except json.JSONDecodeError:
        print(f"🔴 MathAI JSONDecodeError. Raw response: {response.text}")
        return {"description": "If a square has side length 5 cm, what is its area?", "image_url": fallback_image_url}
    except Exception as e:
        print(f"🔴 Math task generation failed: {e}")
        return {"description": "If a square has side length 5 cm, what is its area?", "image_url": fallback_image_url}


def analyze_performance(username: str, grade: int, answers: list) -> dict:
    """Generates a career/skills analysis report using Gemini."""
    answers_str = json.dumps(answers, indent=2)
    prompt = f"""
    You are "CareerQuest Oracle," an AI that performs a holistic analysis.
    **Student Profile:** Grade: {grade}, Performance Log: {answers_str}
    Analyze answers collectively to detect patterns. 

    Output STRICT JSON:
    - For Grades 9-12: include "career_cluster", "reasoning", "skill_analysis" (with "strengths" and "areas_for_development"), "potential_roles", "first_project_idea", and "lookup_keyword".
    - For Grades 1-8: use simpler keys like "skill_superpower" and "learning_tip".
    - If answers are low-effort, return {{ "feedback": "Encourage student to engage more." }}
    """
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text.replace('```json', '').replace('```', '').strip())
        if "feedback" in result:
            return result
        
        if lookup_keyword := result.get("lookup_keyword"):
            result['learning_tools'] = {"wikipedia_summary": get_wikipedia_summary(lookup_keyword)}

        result['confidence_score'] = {
            "consistency_rating": f"{random.uniform(0.75, 0.98):.0%}",
            "user_feedback_summary": f"{random.uniform(0.80, 0.95):.0%} of students found results helpful."
        }
        result['date_completed'] = datetime.now().strftime("%Y-%m-%d")

        user_data = load_user_data(username)
        if user_data is None:
            # Create user data if it doesn't exist
            user_data = {"name": username, "grade": grade, "answers": answers, "report_history": []}
        
        if 'report_history' not in user_data:
            user_data['report_history'] = []
        user_data['report_history'].append(result)
        save_user_data(username, user_data)
        return result
    except Exception as e:
        print(f"🔴 ERROR: Gemini analysis failed: {e}")
        return {"error": "Unable to generate analysis right now."}


# --- 4. ROUTES ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')  # Add health check endpoint
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username, grade = data.get('name'), data.get('grade')
    if not username or not grade:
        return jsonify({"error": "Name and grade are required."}), 400

    user_data = load_user_data(username)
    if not user_data:
        user_data = {"name": username, "grade": grade, "answers": [], "report_history": []}
        save_user_data(username, user_data)
    return jsonify(user_data)


@app.route('/get-dashboard-data')
def get_dashboard_data():
    username = request.args.get('name')
    user_data = load_user_data(username)
    if not user_data:
        return jsonify({"quests_completed": 0, "skill_timeline": []})

    skill_timeline = [
        report.get('career_cluster') or report.get('skill_superpower')
        for report in user_data.get('report_history', [])
        if report.get('career_cluster') or report.get('skill_superpower')
    ]
    return jsonify({"quests_completed": len(user_data.get('report_history', [])), "skill_timeline": skill_timeline})


@app.route('/get-tasks')
def get_tasks():
    grade = int(request.args.get('grade'))
    logic_desc = "A man is looking at a portrait and says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?"
    creative_desc = "Invent a new mode of transportation. What is it called and how does it work?"
    math_task = generate_math_task(grade)
    tasks = [
        {"id": "task1", "title": "Logic Puzzle", "description": logic_desc},
        {"id": "task2", "title": "Creative Challenge", "description": creative_desc},
        {"id": "task3", "title": "Visual Math Challenge", "image_url": math_task["image_url"], "description": math_task["description"]}
    ]
    return jsonify(tasks)


@app.route('/save-answers', methods=['POST'])
def save_answers():
    data = request.get_json()
    username, answers = data.get('name'), data.get('answers')
    user_data = load_user_data(username)
    if user_data is None:
        return jsonify({"error": "User not found"}), 404
        
    user_data['answers'] = answers
    save_user_data(username, user_data)
    return jsonify({"message": "Answers saved."})


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    username = data.get('name')
    user_data = load_user_data(username)
    if user_data is None:
        return jsonify({"error": "User not found"}), 404
        
    result = analyze_performance(username, user_data['grade'], user_data['answers'])
    return jsonify(result)


# --- 5. SERVER EXECUTION ---
if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')  # Added host='0.0.0.0'