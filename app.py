import base64
from io import BytesIO

from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn.functional as F
import mysql.connector as mysql
import tempfile
from inference_sdk import InferenceHTTPClient
import smtplib
import io
import os
from ultralytics import YOLO
from roboflow import Roboflow
import supervision as sv
import cv2
import matplotlib.pyplot as plt
from PIL import Image

app = Flask(__name__)


db_config = {
    'user': 'root',
    'password': 'root',
    'host': '127.0.0.1',
    'database': 'college'
}

def get_db_connection():
    return mysql.connect(**db_config)

def close_db_connection(connection, cursor):
    cursor.close()
    connection.close()

@app.route('/')
def home():
    return render_template('student_marks.html')

@app.route('/insert', methods=['POST'])
def insert():
    try:
        roll_no = request.form['roll_no']
        cgpa = int(request.form['cgpa'])
        year = int(request.form['year'])
        im = request.form['internal_mark']
        em = request.form['external_mark']
        email = request.form['email']

        db_connection = get_db_connection()

        cursor = db_connection.cursor()
        cursor.execute("INSERT into student_marks (roll_no, cgpa, year, internal_mark, external_mark,email) VALUES(%s, %s, %s, %s, %s, %s)", (roll_no, cgpa, year, im, em,email))

        db_connection.commit()

        close_db_connection(db_connection, cursor)

        return redirect(url_for('success'))

    except Exception as e:
        print(e)
        return "Unable to register student data"

@app.route('/update', methods=['POST'])
def update():
    try:
        roll_no = request.form['roll_no']
        cgpa = request.form['cgpa']
        year = request.form['year']
        im = request.form['internal_mark']
        em = request.form['external_mark']
        email = request.form['email']


        db_connection = get_db_connection()
        cursor = db_connection.cursor()
        cursor.execute("INSERT into student_marks (roll_no, cgpa, year, internal_mark, external_mark,email) VALUES(%s, %s, %s, %s, %s, %s)", (roll_no, cgpa, year, im, em,email))
        db_connection.commit()
        close_db_connection(db_connection, cursor)

        return redirect(url_for('success'))

    except Exception as e:
        print(e)
        return "Error: Unable to update the data"

@app.route('/delete', methods=['POST'])
def delete():
    try:
        roll_no = request.form['roll_no']

        db_connection = get_db_connection()
        cursor = db_connection.cursor()
        cursor.execute("DELETE FROM student_marks WHERE roll_no=%s", (roll_no,))
        db_connection.commit()
        close_db_connection(db_connection, cursor)

        return redirect(url_for('success'))

    except Exception as e:
        print(e)
        return "Unable to delete data"

@app.route('/view')
def view():
    try:
        db_connection = get_db_connection()
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM student_marks")
        records = cursor.fetchall()
        close_db_connection(db_connection, cursor)

        return render_template('view.html', records=records)

    except Exception as e:
        print(e)
        return "Error: Unable to view data"

@app.route('/filter', methods=['POST'])
def filter():
    try:
        cgpa = int(request.form['cgpa'])
        year = int(request.form['year'])

        db_connection = get_db_connection()
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM student_marks where cgpa=%s and year=%s",(cgpa,year))
        records = cursor.fetchall()
        close_db_connection(db_connection, cursor)

        return render_template('view.html', records=records)

    except Exception as e:
        print(e)
        return "Error: Unable to view data"

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/update_form')
def update_form():
    return render_template('update_form.html')

@app.route('/delete_form')
def delete_form():
    return render_template('delete_form.html')

@app.route('/filter_form')
def filter_form():
    return render_template('filter_form.html')

@app.route('/mail', methods=['GET'])
def mail():

    emails = request.args.get('emails')
    email_list = emails.split(',')

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)

    email_addr = 'xyz@gmail.com'            #use your mail here
    email_passwd = 'Gmail App Password'     #use your Gmail App Password not Normal Password


    server.login(email_addr, email_passwd)

    for account in email_list:
        server.sendmail(from_addr=email_addr, to_addrs=account, msg="You are selected")

    server.close()

    return render_template('success.html')

# results = model.predict(0, save=True, show=True, conf=0.15)
@app.route('/yolo', methods=['POST'])
def yolo():
    try:
        model1 = YOLO("yolov10n.pt")

        file = request.files['image']
        img = Image.open(file.stream).convert('RGB')

        # Preprocess the image and make predictions
        results = model1(img)

        # Render the results on the image
        annotated_img = results[0].plot()

        Image.fromarray(annotated_img).show()

        annotated_img_file = 'annotated_image.jpg'
        Image.fromarray(annotated_img).save(annotated_img_file)

        return render_template('success.html')

    except Exception as e:
        return f"Error: {e}"

@app.route('/yolo_page')
def yolo_page():
    return render_template('yolo.html')

@app.route('/tree_page')
def tree_page():
    return render_template('tree.html')
#
#
# CLIENT = InferenceHTTPClient(
#     api_url="https://detect.roboflow.com",
#     api_key="oFCpd5K7E1aoaUheWSwp"
# )

@app.route('/tree', methods=['POST'])
def tree():
    try:
        model1 = YOLO("best.pt")

        file = request.files['image']
        img = Image.open(file.stream).convert('RGB')

        # Preprocess the image and make predictions
        results = model1(img)

        # Render the results on the image
        annotated_img = results[0].plot()

        Image.fromarray(annotated_img).show()

        annotated_img_file = 'annotated_image.jpg'
        Image.fromarray(annotated_img).save(annotated_img_file)

        return render_template('success.html')

    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    app.run()
