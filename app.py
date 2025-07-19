from flask import Flask, render_template, request, jsonify
import sqlite3
app = Flask(__name__)
def get_db_connection():
    conn = sqlite3.connect('mechanics.db')
    conn.row_factory = sqlite3.Row
    return conn
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/register_mechanic', methods=['POST'])
def register_mechanic():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO mechanics (name, phone, latitude, longitude) VALUES (?, ?, ?, ?)',
                 (data['name'], data['phone'], data['latitude'], data['longitude']))
    conn.commit()
    conn.close()
    return jsonify({'status': 'Mechanic registered'})
@app.route('/get_mechanics')
def get_mechanics():
    lat = float(request.args.get('lat'))
    lng = float(request.args.get('lng'))
    conn = get_db_connection()
    mechanics = conn.execute('SELECT * FROM mechanics').fetchall()
    conn.close()
    results = [
        dict(row) for row in mechanics
        if abs(row['latitude'] - lat) < 0.1 and abs(row['longitude'] - lng) < 0.1
    ]
    return jsonify(results)
if __name__ == '__main__':
    app.run(debug=True)
