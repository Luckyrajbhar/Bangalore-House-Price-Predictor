from flask import Flask, render_template, request, jsonify
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import util

# Configure Flask to use templates and static folders
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
template_dir = os.path.join(base_dir, 'templates')
static_dir = os.path.join(base_dir, 'static')

print(f"Template directory: {template_dir}")
print(f"Static directory: {static_dir}")
print(f"Template exists: {os.path.exists(os.path.join(template_dir, 'index.html'))}")

app = Flask(__name__,
            template_folder=template_dir,
            static_folder=static_dir)

# Load artifacts when module is imported (for production deployment)
util.load_saved_artifacts()

@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error rendering template: {str(e)}", 500

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    try:
        total_sqft = float(request.form.get('total_sqft', request.json.get('total_sqft') if request.is_json else None))
        location = request.form.get('location', request.json.get('location') if request.is_json else None)
        bhk = int(request.form.get('bhk', request.json.get('bhk') if request.is_json else None))
        bath = int(request.form.get('bath', request.json.get('bath') if request.is_json else None))

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        
        response = jsonify({
            'estimated_price': estimated_price
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)