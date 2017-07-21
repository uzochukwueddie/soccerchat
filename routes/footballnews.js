module.exports = (app) => {
    
    app.get('/latest-football-news', (req, res) => {
        res.render('news/footballnews', {title: "Soccerkik - Latest Football News"});
    });
}


