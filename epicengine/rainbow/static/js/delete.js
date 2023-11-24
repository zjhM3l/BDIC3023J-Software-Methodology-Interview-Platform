$(document).ready(function (){
    $("#delete_data").click(function (){
        $.ajax({
            url:"/delete_data",
            type:'POST',
            dataType:"json",
            contentType:'application/json;charset=utf-8',
            success: function (data){
            },
            error:function (){
            }
        });
    });
})