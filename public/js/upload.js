$(document).ready(function(){
    
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });
    
    $('#upload-input').on('change', function(){
        var uploadInput = $('#upload-input');
//        var club = $('#soccerclub')
        
        if(uploadInput.val() != ''){
            var formData = new FormData();
            
            formData.append('upload', uploadInput[0].files[0]);
            
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    uploadInput.val('');
                }
            });
        }
    });
    
})























