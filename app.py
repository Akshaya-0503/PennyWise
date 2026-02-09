from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'pennywise-secret-key-2024'  # Change in production
CORS(app, supports_credentials=True)

# JSON database file
USERS_FILE = 'users.json'

# Initialize users file if it doesn't exist
def init_users_file():
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            json.dump([], f)

# Read users from JSON
def read_users():
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

# Write users to JSON
def write_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

# Initialize
init_users_file()

@app.route('/')
def home():
    return jsonify({
        "message": "PennyWise Backend API",
        "endpoints": {
            "/register": "POST - Register new user",
            "/login": "POST - Login user",
            "/logout": "POST - Logout user",
            "/profile": "GET - Get user profile"
        }
    })

# Register new user
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Validation
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Read existing users
        users = read_users()
        
        # Check if user already exists
        for user in users:
            if user['email'] == email:
                return jsonify({"error": "User already exists"}), 400
        
        # Create new user
        new_user = {
            "id": len(users) + 1,
            "email": email,
            "password": password,  # In production, hash this!
            "name": data.get('name', ''),
            "phone": data.get('phone', ''),
            "created_at": datetime.now().isoformat(),
            "round_up_level": 10,
            "investment_threshold": 200,
            "portfolio": {
                "gold": 40,
                "etf": 30,
                "index": 30
            },
            "balance": 0,
            "total_invested": 0
        }
        
        # Add to users list
        users.append(new_user)
        write_users(users)
        
        # Set session
        session['user_id'] = new_user['id']
        session['user_email'] = email
        
        return jsonify({
            "message": "Registration successful",
            "user": {
                "id": new_user['id'],
                "email": new_user['email'],
                "name": new_user['name'],
                "balance": new_user['balance']
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login user
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        users = read_users()
        
        # Find user
        for user in users:
            if user['email'] == email and user['password'] == password:
                # Set session
                session['user_id'] = user['id']
                session['user_email'] = email
                
                return jsonify({
                    "message": "Login successful",
                    "user": {
                        "id": user['id'],
                        "email": user['email'],
                        "name": user['name'],
                        "balance": user['balance'],
                        "total_invested": user['total_invested']
                    }
                })
        
        return jsonify({"error": "Invalid email or password"}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Logout user
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

# Get user profile
@app.route('/profile', methods=['GET'])
def profile():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    users = read_users()
    user_id = session['user_id']
    
    for user in users:
        if user['id'] == user_id:
            return jsonify({
                "user": {
                    "id": user['id'],
                    "email": user['email'],
                    "name": user['name'],
                    "phone": user.get('phone', ''),
                    "balance": user['balance'],
                    "total_invested": user['total_invested'],
                    "round_up_level": user['round_up_level'],
                    "investment_threshold": user['investment_threshold'],
                    "portfolio": user['portfolio'],
                    "created_at": user['created_at']
                }
            })
    
    return jsonify({"error": "User not found"}), 404

# Update user settings
@app.route('/settings', methods=['PUT'])
def update_settings():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        data = request.json
        user_id = session['user_id']
        
        users = read_users()
        
        for i, user in enumerate(users):
            if user['id'] == user_id:
                # Update settings
                if 'round_up_level' in data:
                    users[i]['round_up_level'] = data['round_up_level']
                if 'investment_threshold' in data:
                    users[i]['investment_threshold'] = data['investment_threshold']
                if 'portfolio' in data:
                    users[i]['portfolio'] = data['portfolio']
                
                write_users(users)
                
                return jsonify({
                    "message": "Settings updated",
                    "settings": {
                        "round_up_level": users[i]['round_up_level'],
                        "investment_threshold": users[i]['investment_threshold'],
                        "portfolio": users[i]['portfolio']
                    }
                })
        
        return jsonify({"error": "User not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Check if user is logged in
@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({"authenticated": True, "user_id": session['user_id']})
    return jsonify({"authenticated": False})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')