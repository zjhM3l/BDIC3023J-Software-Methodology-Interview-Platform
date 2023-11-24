// ajax for register
$(document).ready(function (){
    $.r_validator = $("#registerForm").validate({
        rules:{
            r_email:{
                required:true,
                email:true,
                available:{
                    url:"/registervalidate/email",
                    type:"post",
                    data:{
                        email:function(){return $("#r_email").val();}
                    }
                }
            },
            r_username:{
                required:true,
                maxlength:15
            },
            r_password:{
                required:true,
                minlength:6,
                maxlength:15
            },
            r_password2:{
                required:true,
                minlength:6,
                maxlength:15,
                validatePasswordSame:true
            }
        },
        // give messages to users
        messages:{
            r_email:{
                required:"Can't be blank",
                email:"Must be an email",
                available:"This Email has already exist"
            },
            r_username:{
                required:"Can't be blank",
                maxlength:"The password has a maximum of 15 numbers"
            },
            r_password:{
                required:"Can't be blank",
                minlength:"The password must have at least six numbers",
                maxlength:"The password has a maximum of 15 numbers"
            },
            r_password2:{
                required:"Can't be blank",
                minlength:"The password must have at least six numbers",
                maxlength:"The password has a maximum of 15 numbers",
                validatePasswordSame:"The two passwords are not the same"
            }
        },
        errorPlacement: function (error, element){
            error.appendTo(element.parent());
        }
    });
    // add one more message
    $.validator.addMethod(
        "validatePasswordSame",
        function (value, element, params){
            $.ajax({
                type:"POST",
                url:"/validate/pssame",
                dataType:"json",
                data:{
                    password1:function (){return $("#r_password").val();},
                    password2:function (){return $("#r_password2").val();}
                },
                success:function (data){
                    if(!data){
                        $("#r_helpmessage").html("The two passwords are not the same")
                    }else
                        $("#r_helpmessage").html("")
                }
            });
            return true;
            },
        "The two passwords are not the same"
    );
});