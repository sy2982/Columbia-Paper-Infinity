from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

# Initial data

current_id = 4

sales = [
    {"id": 1, "salesperson": "James D. Halpert", "client": "Shake Shack", "reams": 100},
    {"id": 2, "salesperson": "Stanley Hudson", "client": "Toast", "reams": 400},
    {"id": 3, "salesperson": "Michael G. Scott", "client": "Computer Science Department", "reams": 1000},
]

clients = ["Shake Shack", "Toast", "Computer Science Department", "Teacher's College", "Starbucks", "Subsconscious", "Flat Top", "Joe's Coffee", "Max Caffe", "Nussbaum & Wu", "Taco Bell"]

# Routes

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/infinity')
def log_sales():
    return render_template('log_sales.html', sales=sales, clients=clients)

# Ajax functions

@app.route('/save_sale', methods=['POST'])
def save_sale():
    global current_id
    global sales
    global clients

    new_sale = request.get_json()
    current_id += 1
    new_sale["id"] = current_id
    sales.insert(0, new_sale)

    if new_sale["client"] not in clients:
        clients.append(new_sale["client"])

    return jsonify(sales=sales, clients=clients)

@app.route('/delete_sale', methods=['POST'])
def delete_sale():
    global sales

    sale_id = request.get_json()["id"]
    sales = [sale for sale in sales if sale["id"] != sale_id]

    return jsonify(sales=sales)

if __name__ == '__main__':
    app.run(debug=True)