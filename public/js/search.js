$(document).ready(function(){
    
    $('#search-form').on('click', function(e){
        
        var search = $('#search').val();
        
        var valid = true;
        
        if(search === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Search field is empty</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid === true){
            $.ajax({
                url: '/results',
                type: 'POST',
                data: {
                    search: search
                },
                success: function(){
                    $('#search').val('');
                }
            })
        }else {
            return false;
        }
    })
})