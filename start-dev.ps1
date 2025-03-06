# Démarrer le backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python app.py"

# Attendre que le backend soit prêt
Start-Sleep -Seconds 5

# Démarrer le frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
