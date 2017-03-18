//$(document).ready(function(){
//    $('#search').change(function(){
//        var search = $(this).val();
//        var club_Name = $('#club_Name').val();
//        
//        $.ajax({
//            url: '/group/'+club_Name,
//            type: 'GET',
//            data: {search: search, club_Name:club_Name},
//            success: function(data){
//                if(!data){
//                    $('#messages').text(data)
//                }else{
//                    $('#messages').text('No results found')
//                }
//            }
//        })
//    })
//})