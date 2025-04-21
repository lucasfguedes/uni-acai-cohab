document.querySelector("#register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;
    const confirmPassword = document.getElementById("confirmar-senha").value;
    const mensagem = document.getElementById("mensagem");
  
    if (password !== confirmPassword) {
      mensagem.textContent = "Senhas não coincidem!";
      mensagem.style.color = "red";
      return;
    }
  
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  
    const data = await res.json();
    mensagem.textContent = data.message;
    mensagem.style.color = data.success ? "green" : "red";
  
    if (data.success) {
      setTimeout(() => {
        window.location.href = "user_page_login.html";
      }, 2000);
    }
  });
  