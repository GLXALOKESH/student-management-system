
token = getCookie('authToken');
if(!token){
    window.location.href = '/frontend/pages/unauthoriseVisit.html';
}







function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}


