$(document).ready(function(){

    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });

    $('#add-input').on('change', function(){
        var addInput = $('#add-input');
//        var club = $('#soccerclub')
        
        if(addInput.val() != ''){
            var formData = new FormData();
            
            formData.append('upload', addInput[0].files[0]);

            $('#completed').html('File Uploaded');
            
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    addInput.val('');
                }
            })
        }
    });

    
    $('#profile').on('click', function(e){
        // e.preventDefault()
        
        var fullname = $('#fullname').val();
        var city = $('#city').val();
        var description = $('#description').val();
        var gender = $('#gender').val();
        var userImage = $('#add-input').val();
        
        var valid = true;
        
        if(fullname == '' || city == '' || description == '' || userImage == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You cannot submit an empty form field</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    fullname: fullname,
                    city: city,
                    description: description,
                    gender: gender,
                    userImage: userImage
                },
                success: function(data){
                    $('#fullname').val('');
                    $('#city').val('');
                    $('#description').val('');

                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    })
    
    $('#nationalTeam').on('click', function(e){
        e.preventDefault()
        
        var national = $('#national').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite national team field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    national: national
                },
                success: function(data){
//                    $('#fullname').val('');
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    });
    
    $('#favClubBtn').on('click', function(e){
        e.preventDefault()
        
        var favClub = $('#favClub').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite clubs field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favClub: favClub
                },
                success: function(data){
//                    $('#fullname').val('');
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    });
    
    $('#favPlayersBtn').on('click', function(e){
        e.preventDefault()
        
        var favPlayers = $('#favPlayers').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite clubs field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favPlayers: favPlayers
                },
                success: function(data){
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    })
    
})