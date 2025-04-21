document.querySelector("#login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("senha-login").value;
    const mensagemLogin = document.getElementById("mensagem-login");
  
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (data.success) {
      mensagemLogin.textContent = "Login bem-sucedido!";
      mensagemLogin.style.color = "green";
  
      // Simples exemplo de redirecionamento após login
      setTimeout(() => {
        window.location.href = "/pages/painel_usuario.html"; // você pode criar essa página
      }, 2000);
    } else {
      mensagemLogin.textContent = data.message;
      mensagemLogin.style.color = "red";
    }
  });
  