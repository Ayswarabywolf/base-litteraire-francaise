from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return jsonify({"message": "Bienvenue sur l'API du Cours HLP!"})

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG', 'True') == 'True')
