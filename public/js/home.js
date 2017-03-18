$(document).ready(function(){

    
    $('#add_fav').on('submit', function(e){
        e.preventDefault()
        
        var id = $('#id').val();
        var clubName = $('#club_Name').val();
        
        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                clubName: clubName
            },
            success: function(data){
                console.log(clubName);
            }
        });
    })
    
})