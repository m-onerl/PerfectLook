document.getElementById('registerForm').addEventListener('submit', function(event) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confpassword = document.getElementById('confpassword').value;
    var number = document.getElementById('number').value;
    var errorMessage = document.getElementById('error-message');

    if (!email.includes('@')) {
        errorMessage.textContent = 'Proszę wpisać poprawny adres email zawierający "@"';
        event.preventDefault();
    } else if (password !== confpassword) {
        errorMessage.textContent = 'Hasła nie są zgodne';
        event.preventDefault();
    } else if (number.length < 9) {
        errorMessage.textContent = 'Numer kontaktowy jest za krótki';
        event.preventDefault();
    } else if (number.length > 9) {
        errorMessage.textContent = 'Numer kontaktowy jest za długi';
        event.preventDefault();
    } else if (!/^\d+$/.test(number)) {
        errorMessage.textContent = 'Numer kontaktowy może zawierać tylko cyfry';
        event.preventDefault();
    } else {
        errorMessage.textContent = '';
    }
});
