// Click to switch between login and registration

const container = document.querySelector('#container');
const signInButton = document.querySelector('#signIn');
const signUpButton = document.querySelector('#signUp');

signUpButton.addEventListener('click',() => container.classList.add('right-panel-active'))
signInButton.addEventListener('click',() => container.classList.remove('right-panel-active'))

// ajax for login
$(document).ready(function (){
    $.l_validator = $("#loginForm").validate({
        rules:{
            l_email:{
                required:true,
                email:true,
                remote:{
                    url:"/loginvalidate/email",
                    type:"post",
                    data:{
                        email:function(){return $("#l_email").val();}
                    }
                }
            },
            l_password:{
                required:true,
                minlength:6,
                maxlength:15,
                validateUser:true
            }
        },
        // give messages to users when they try to log in
        messages:{
            l_email:{
                required:"The email can't be blank",
                email:"Must be an email",
                remote:"You haven't register this email"
            },
            l_password:{
                required:"Can't be blank",
                minlength:"The password must have at least six numbers",
                maxlength:"The password has a maximum of 15 numbers"
            }
        },
        errorPlacement: function (error, element){
            error.appendTo(element.parent());
        }
    });
    // prompts the user whether the account and password are correct or not
    $.validator.addMethod(
        "validateUser",
            function (value, element, params){
                $.ajax({
                    type:"POST",
                    url:"/validate/password",
                    dataType:"json",
                    data:{
                        email:function(){return $("#l_email").val();},
                        l_password:function(){return $("#l_password").val();}
                    },
                    success:function (data){
                        if(!data){
                            $("#l_helpmessage").html("Username or password fail");
                        }else {
                            $("#l_helpmessage").html("true");
                        }
                    }
                });
                return true;
            },
    );
});

