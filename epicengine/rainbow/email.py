from flask import render_template

from flask_mail import Message

from . import mail


def send_email(to, subject, template, user, token):
    msg = Message(subject, sender='2272393014@qq.com', recipients=[to])
    msg.html = render_template(template + '.txt', user=user, token=token)
    mail.send(msg)
