from flask import Flask, request, jsonify
import util

app = Flask(__name__)
util.load_saved_artifacts()


@app.route('/api/predict_home_price', methods=['GET'])
def predict_home_price():
    total_sqft = float(request.args.get('total_sqft'))
    location = request.args.get('location')
    bhk = int(request.args.get('bhk'))
    bath = int(request.args.get('bath'))

    response = jsonify({
        'estimated_price': util.get_estimated_price(location, total_sqft, bhk, bath)
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/')
def home():
    return "🏡 House Price Prediction API is live on Vercel 🚀"

