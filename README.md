eden-snake-game/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── audio.js
│       └── game.js
├── templates/
│   └── index.html
├── app.py
├── wsgi.py
├── main.py
├── build.sh
└── requirements.txt
```

## Local Setup Instructions

1. Make sure you have Python 3.11 or later installed on your machine.

2. Create a new directory and set up the project structure:
```bash
mkdir eden-snake-game
cd eden-snake-game
```

3. Create a Python virtual environment and activate it:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

4. Install the required packages:
```bash
pip install flask gunicorn
```

5. Create all the necessary directories and files as shown in the project structure above.

6. Copy the provided code into their respective files.

7. Run the application locally:
```bash
python main.py
```

8. Open your web browser and navigate to:
```
http://localhost:5000