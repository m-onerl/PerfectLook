
  const loginIcon = document.getElementById('login-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');

  loginIcon.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.toggle('hidden');
  });

  window.addEventListener('click', (e) => {
    if (!loginIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add('hidden');
    }
  });
