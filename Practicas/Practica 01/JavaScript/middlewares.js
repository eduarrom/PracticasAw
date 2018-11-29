//Funcion para controlar el acceso a determinadas paginas
function controlAcceso(request, response, next){
    if (request.session.currentUser != null){
        response.locals.currentUser = request.session.currentUser;
        next();
    } else {
        response.redirect("/login");
    }
}

module.exports = {
    controlAcceso:controlAcceso
}
    
