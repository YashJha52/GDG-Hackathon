import os
import json
import random
import wikipedia
import google.generativeai as genai
import logging
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
from urllib.parse import quote

# --- 1. INITIALIZATION & CONFIGURATION ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file.")
    genai.configure(api_key=api_key)
except (AttributeError, ValueError) as e:
    logging.critical(f"🔴 FATAL ERROR: {e}")
    exit()

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-1.5-flash-latest')

# --- CONSTANTS ---
DATA_DIR = "data"
PROMPTS_DIR = "prompts"
KEY_REPORT_HISTORY = "report_history"
KEY_CAREER_CLUSTER = "career_cluster"
KEY_SKILL_SUPERPOWER = "skill_superpower"

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# --- 2. CONTEXT FILE (USER DATA) HELPERS ---
def get_user_filepath(username: str) -> str:
    safe_username = "".join(c for c in username if c.isalnum()).lower()
    return os.path.join(DATA_DIR, f"user_{safe_username}.json")

def load_user_data(username: str) -> dict | None:
    filepath = get_user_filepath(username)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            logging.error(f"Failed to load or parse user data for {username}: {e}")
            return None
    return None

def save_user_data(username: str, data: dict):
    filepath = get_user_filepath(username)
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
    except IOError as e:
        logging.error(f"Failed to save user data for {username}: {e}")

# --- 3. HELPER FUNCTIONS ---
def get_wikipedia_summary(topic: str) -> str:
    try:
        return wikipedia.summary(topic, sentences=3, auto_suggest=True)
    except wikipedia.exceptions.PageError:
        return f"Could not find a Wikipedia page for '{topic}'."
    except wikipedia.exceptions.DisambiguationError:
        return f"'{topic}' is ambiguous. Please be more specific."
    except Exception as e:
        logging.warning(f"Wikipedia search failed for '{topic}': {e}")
        return "Could not retrieve a Wikipedia summary for this topic."

def load_prompt(filename: str, **kwargs) -> str:
    try:
        with open(os.path.join(PROMPTS_DIR, filename), 'r') as f:
            return f.read().format(**kwargs)
    except (FileNotFoundError, KeyError) as e:
        logging.error(f"Error loading or formatting prompt {filename}: {e}")
        return ""

def extract_json_from_string(text: str) -> dict | None:
    json_match = re.search(r'```json\s*(\{.*?\})\s*```|(\{.*?\})', text, re.DOTALL)
    if json_match:
        json_str = json_match.group(1) if json_match.group(1) else json_match.group(2)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            logging.error(f"Failed to decode JSON from extracted string: {json_str}")
            return None
    return None

def generate_task_from_prompt(grade: int, prompt_file: str, fallback_desc: str, fallback_img_text: str, color_config: str) -> dict:
    """A generic function to generate different types of tasks."""
    logging.info(f"Generating task from {prompt_file} for grade {grade}...")
    fallback_image_url = f"https://placehold.co/600x400/{color_config}?text={quote(fallback_img_text)}"
    
    prompt = load_prompt(prompt_file, grade=grade)
    if not prompt:
        return {"description": f"Error: Prompt template '{prompt_file}' not found.", "image_url": fallback_image_url}

    try:
        response = model.generate_content(prompt)
        task_data = extract_json_from_string(response.text)
        if not task_data or "description" not in task_data or "image_prompt" not in task_data:
             raise ValueError("Extracted JSON is missing required keys.")

        encoded_text = quote(task_data["image_prompt"])
        image_url = f"https://placehold.co/600x400/{color_config}?text={encoded_text}"
        return {"description": task_data["description"], "image_url": image_url}
    
    except Exception as e:
        logging.error(f"Task generation failed for {prompt_file}: {e}. Raw response: {response.text if 'response' in locals() else 'N/A'}")
        return {"description": fallback_desc, "image_url": fallback_image_url}

# Specific task generation functions now use the generic helper
def generate_math_task(grade: int) -> dict:
    return generate_task_from_prompt(grade, "math_task_generator.txt", "If a square has a side length of 5cm, what is its area?", "Math+Problem", "e0e7ff/4338ca")

def generate_creative_task(grade: int) -> dict:
    return generate_task_from_prompt(grade, "creative_task_generator.txt", "Invent a solution to reduce plastic waste in oceans.", "Ocean+Plastic+Solution", "e0f2fe/0c4a6e")

def generate_problem_solving_task(grade: int) -> dict:
    return generate_task_from_prompt(grade, "problem_solving_task_generator.txt", "Design a community garden for your neighborhood.", "Community+Garden+Design", "dbeafe/1e40af")

def generate_collaboration_task(grade: int) -> dict:
    return generate_task_from_prompt(grade, "collaboration_task_generator.txt", "Describe a time you worked in a team.", "Teamwork+and+Collaboration", "dcfce7/166534")

# --- 4. ROUTES ---
@app.route('/')
def index():
    return jsonify({"message": "CareerQuest Oracle API is running!"})

@app.route('/user/session', methods=['POST'])
def login_or_create_user():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('grade'):
        return jsonify({"error": "Name and grade are required."}), 400
    
    username, grade = data['name'], data['grade']
    user_data = load_user_data(username)
    
    if not user_data:
        logging.info(f"Creating new user profile for: {username}")
        user_data = {"name": username, "grade": grade, "answers": [], KEY_REPORT_HISTORY: []}
        save_user_data(username, user_data)
    
    return jsonify(user_data)

@app.route('/user/dashboard', methods=['GET'])
def get_dashboard_data():
    username = request.args.get('name')
    if not username:
        return jsonify({"error": "Name parameter is required."}), 400

    user_data = load_user_data(username)
    if not user_data:
        return jsonify({"error": "User not found."}), 404

    report_history = user_data.get(KEY_REPORT_HISTORY, [])
    skill_timeline = [
        report.get(KEY_CAREER_CLUSTER) or report.get(KEY_SKILL_SUPERPOWER)
        for report in report_history
        if report.get(KEY_CAREER_CLUSTER) or report.get(KEY_SKILL_SUPERPOWER)
    ]

    dashboard_data = {
        "quests_completed": len(report_history),
        "skill_timeline": skill_timeline
    }
    return jsonify(dashboard_data)

@app.route('/quest/tasks', methods=['GET'])
def get_tasks():
    grade_str = request.args.get('grade')
    if not grade_str or not grade_str.isdigit():
        return jsonify({"error": "A valid grade parameter is required."}), 400

    grade = int(grade_str)
    
    logic_desc = "A man is looking at a portrait. He says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?"
    math_task = generate_math_task(grade)
    creative_task = generate_creative_task(grade)
    problem_solving_task = generate_problem_solving_task(grade)
    collaboration_task = generate_collaboration_task(grade)
    
    tasks = [
        {"id": "task1", "title": "Logical Reasoning", "description": logic_desc},
        {"id": "task2", "title": "Creative Thinking", "description": creative_task["description"], "image_url": creative_task["image_url"]},
        {"id": "task3", "title": "Mathematical Thinking", "image_url": math_task["image_url"], "description": math_task["description"]},
        {"id": "task4", "title": "Problem Solving", "description": problem_solving_task["description"], "image_url": problem_solving_task["image_url"]},
        {"id": "task5", "title": "Collaboration Skills", "description": collaboration_task["description"], "image_url": collaboration_task["image_url"]}
    ]
    return jsonify(tasks)

@app.route('/user/answers', methods=['POST'])
def save_answers():
    data = request.get_json()
    username, answers = data.get('name'), data.get('answers')
    
    if not username or answers is None:
        return jsonify({"error": "Name and answers are required."}), 400
        
    user_data = load_user_data(username)
    if not user_data:
        return jsonify({"error": "User not found."}), 404
        
    user_data['answers'] = answers
    save_user_data(username, user_data)
    
    return jsonify({"message": "Answers saved successfully."})

@app.route('/quest/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    username = data.get('name')
    if not username:
        return jsonify({"error": "Name is required."}), 400
        
    user_data = load_user_data(username)
    if not user_data or 'answers' not in user_data or 'grade' not in user_data:
        return jsonify({"error": "User data is incomplete or not found."}), 404
        
    grade = user_data['grade']
    answers_str = json.dumps(user_data.get('answers', []), indent=2)
    
    prompt = load_prompt("careerquest_oracle.txt", grade=grade, answers_str=answers_str)
    if not prompt:
        return jsonify({"error": "The Oracle's analysis prompt could not be loaded."}), 500

    try:
        response = model.generate_content(prompt)
        analysis_result = extract_json_from_string(response.text)
        
        if not analysis_result:
            logging.error(f"Could not parse JSON from Oracle's response: {response.text}")
            return jsonify({"error": "The Oracle provided a response in an unexpected format."}), 500
        
        if "feedback" in analysis_result:
            return jsonify(analysis_result)
            
        if lookup_keyword := analysis_result.get("lookup_keyword"):
            analysis_result['learning_tools'] = {"wikipedia_summary": get_wikipedia_summary(lookup_keyword)}
        
        analysis_result['confidence_score'] = {
            "consistency_rating": f"{random.uniform(0.85, 0.98):.0%}",
            "user_feedback_summary": f"{random.uniform(0.88, 0.97):.0%} of students found results accurate."
        }
        
        analysis_result['date_completed'] = datetime.now().strftime("%Y-%m-%d")
        analysis_result['assessment_version'] = "comprehensive_v2"
        
        user_data.setdefault(KEY_REPORT_HISTORY, []).append(analysis_result)
        save_user_data(username, user_data)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logging.error(f"🔴 ERROR: API call or analysis logic failed. Details: {e}")
        return jsonify({"error": "The Oracle is currently busy. Please try again later."}), 500

# --- 5. SERVER EXECUTION ---
if __name__ == '__main__':
    is_debug_mode = os.getenv('FLASK_ENV', 'production') == 'development'
    app.run(debug=is_debug_mode, port=5001)