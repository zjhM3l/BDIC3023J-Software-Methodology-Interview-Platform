from flask import render_template, request, flash, redirect, url_for, jsonify

from rainbow import app, db, state_storage
from rainbow.email import send_email

from rainbow.models import User


@app.route('/')
def index():
    user = state_storage.get_user()
    return render_template('index.html', user=user)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
            The login function is partially,
            validated and then load the user into current user.

            :return url: login.html/index.html
        """
    if request.method == "GET":
        app.logger.info('in login')
        return render_template('login.html')
    else:
        email = request.form.get("l_email")
        password = request.form.get("l_password")
        user = User.query.filter_by(email=email).first()
        if user is None:
            app.logger.warning('username not exist')
            flash("username fail")
            return redirect(url_for('.login'))
        if user.verify_password(password):
            app.logger.info(user.username + "and" + password + 'successfully login')
            state_storage.set_user(user)
            flash("You have successfully logged in")
            return redirect(request.args.get('next') or url_for('index'))
        app.logger.warning('username or password fail')
        flash("username or password fail")
        return redirect(url_for('.login'))


@app.route('/validate/password', methods=['POST', 'GET'])
def validatepassword():
    """
        The ajax backend to assist with the login process
        to detect if a user's password input match email.

        :return jsonify:
    """
    email = request.form.get("email")
    password = request.form.get("l_password")
    # print(email)
    # print(password)
    user = User.query.filter_by(email=email).first()
    if user is not None and user.verify_password(password):
        app.logger.info(user.username + "and" + password + "checked")
        return jsonify(True)
    app.logger.warning("login validate password checked fail")
    return jsonify(False)


@app.route('/loginvalidate/email', methods=['POST', 'GET'])
def validateemailexist():
    """
        The ajax backend to assist with the login process
        to detect if a user's email input exits.

        :return jsonify:
    """
    email = request.form.get('email')
    if User.query.filter_by(email=email).first():
        app.logger.info(email + "login validate email exist checked")
        return jsonify(True)
    app.logger.warning("login validate email exist checked failed")
    return jsonify(False)


@app.route('/validate/pssame', methods=['POST', 'GET'])
def passwordsame():
    """
        The ajax backend to assist with the login process
        to detect if a user's passwords input are the same.

        :return jsonify:
    """
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')
    if password1 == password2:
        app.logger.info(password1 + "register validate password same checked")
        return jsonify(True)
    app.logger.warning(password1 + "and" + password2 + "register validate password same checked failed")
    return jsonify(False)


@app.route('/register', methods=['GET', 'POST'])
def register():
    """
        The registration function is partially,
        validated and then written to the database.

        :return user: db.User that have registered
        :return url: login.html/index.html
    """
    if request.method == 'GET':
        return render_template('login.html')
    else:
        email = request.form.get("r_email")
        password = request.form.get("r_password")
        username = request.form.get("r_username")
        user = User(email=email,
                    username=username,
                    password=password)
        db.session.add(user)
        db.session.commit()

        token = user.generate_confirmation_token()
        if send_email(user.email, 'Nuggets Confirmation', 'confirm', user=user, token=token):
            flash('The email address is not existed or the network is not connected')
        else:
            flash('You can now check your email')
        user = User.query.filter_by(email=request.form.get("r_email"))
        state_storage.set_user(user)
        return render_template('login.html', user=user)


@app.route('/confirm/<token>')
def confirm(token):
    current_user = User.query.filter().order_by(User.timestamp.desc()).first()
    if current_user.confirmed:
        app.logger.info("confirm text sent to+" + current_user.email)
        return redirect(url_for('index'))
    if current_user.confirm(token):
        app.logger.info("confirm success+")
        db.session.commit()
    else:
        app.logger.warning('This confirmation link is unavailable or has timed out')
        flash('This confirmation link is unavailable or has timed out')
    current_user.statue = True
    return redirect(url_for('index'))


@app.route('/unconfirmed')
def unconfirmed():
    current_user = User.query.filter().order_by(User.timestamp.desc()).first()
    if current_user.is_anonymous or current_user.confirmed:
        return redirect(url_for('index'))
    app.logger.warning('Invalid email, please try it again')
    flash('Invalid email, please try it again')
    return render_template('unconfirmed.html')


@app.route('/confirm')
def resend_confirmation():
    current_user = User.query.filter().order_by(User.timestamp.desc()).first()
    token = current_user.generate_confirmation_token()
    send_email(current_user.email, 'confirm your account',
               'confirm', current_user, token)
    flash('The email of the new confirmed account has been sent to the mailbox, please note that check.')
    return redirect(url_for('index'))


@app.route('/registervalidate/email', methods=['POST', 'GET'])
def validateemail():
    """
        The ajax backend to assist with the registration process
        to detect if a user's email has been registered.

        :return jsonify:
    """
    email = request.form.get('email')
    if User.query.filter_by(email=email).first():
        app.logger.warning(email + "register validate email exist checked failed")
        return jsonify(False)
    app.logger.info("register validate email exist checked")
    return jsonify(True)


@app.route('/logout')
def logout():
    user = state_storage.get_user()
    curren_user = User.query.filter(User.id == user.id).first()
    app.logger.info(curren_user.email + "log out successfully")
    state_storage.quit()
    flash('You have been logged out.')
    return redirect(url_for('.index'))


@app.route('/resume')
def resume():
    return render_template('resume.html')


@app.route('/calender')
def calender():
    pass


@app.route('/whiteboard')
def whiteboard():
    return render_template('whiteboard.html')


@app.route('/room')
def room():
    return render_template('room.html')


@app.route('/lobby')
def lobby():
    return render_template('lobby.html')