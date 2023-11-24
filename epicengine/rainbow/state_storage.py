current_user = None


def _init():
    """
        Initialize the user listener at runtime,
        default None if not logged in.
    """
    global current_user
    current_user = None


def set_user(user):
    """
        Set the current user.

        :param user: The current user.
        :type user: db.User
    """
    global current_user
    current_user = user


def get_user():
    """
        Get the current user.
    """
    return current_user


def quit():
    """
        Clear the current user.
    """
    global current_user
    current_user = None
