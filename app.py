from flask import Flask, render_template, jsonify, request
from blockchain import Blockchain
import tensorflow as tf
import numpy as np

app = Flask(__name__)
blockchain = Blockchain()
ai_model = tf.keras.models.load_model('ai_models/color_predictor.h5')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/design')
def designer():
    return render_template('design.html')

@app.route('/ar')
def ar_view():
    return render_template('ar.html')

@app.route('/api/generate_colors', methods=['POST'])
def generate_colors():
    base_color = request.json['color']
    rgb = [int(base_color[i:i+2], 16) for i in (1,3,5)]
    prediction = ai_model.predict(np.array([rgb]))[0]
    return jsonify({
        'primary': f'#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}',
        'secondary': f'#{int(prediction[0]):02x}{int(prediction[1]):02x}{int(prediction[2]):02x}'
    })

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    blockchain.new_user(data['address'], data['username'])
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(ssl_context='adhoc', port=443)