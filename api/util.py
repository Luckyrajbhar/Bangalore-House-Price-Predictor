import json
import pickle
import numpy as np
import os

__data_columns = None
__locations = None
__model = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'artifacts')

def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns, __locations, __model

    columns_file = os.path.join(MODEL_PATH, "columns.json")
    model_file = os.path.join(MODEL_PATH, "banglore_home_prices_model.pickle")

    with open(columns_file, "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

    with open(model_file, "rb") as f:
        __model = pickle.load(f)

    print("loading saved artifacts...done")

def get_estimated_price(location, sqft, bhk, bath):
    if __model is None:
        load_saved_artifacts()

    if location is None:
        return 0  # Safe fallback

    location = location.lower()

    try:
        loc_index = __data_columns.index(location)
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def get_location_names():
    if __locations is None:
        load_saved_artifacts()
    return __locations

def get_data_columns():
    return __data_columns

# Load model on cold start
load_saved_artifacts()
