from flask import Flask, send_file, request, jsonify, send_from_directory
from dataHandler import dataService
from flask_cors import CORS
import simplejson
import os

app = Flask(__name__,
            static_folder = "./dist/static",
            template_folder = "./dist")
ds = dataService.dataHandler
CORS(app, resources={r"/*": {"origins": "*"}})
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/data')
def data():
    data = ds.getAll()
    return simplejson.dumps(data, ignore_nan=False)

@app.route('/keyword/<key>')
def keyword(key):
    data = ds.getKeyWord(key)
    return simplejson.dumps(data, ignore_nan=False)

@app.route('/data_request',  methods=['POST'])
def data_request():
    form = request.get_json()['configure']
    print(form)
    data = ds.getData(form)
    return simplejson.dumps(data, ignore_nan=False)

@app.route('/word_request', methods=['POST'])
def word_request():
    form = request.get_json()['configure']
    period = request.get_json()['period']
    data = ds.getCount(period)
    return simplejson.dumps(data, ignore_nan=False)

app.run(host='0.0.0.0', port=1111, use_reloader=False, debug=True)
