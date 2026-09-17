
async function criarConta() {
    const nome = document.querySelector(".box-sign-user input").value;
    const email = document.querySelector(".box-sign-email input").value;
    const password = document.querySelector(".box-sign-password input").value;
  
    if (!nome.trim() || !email.trim() || !password.trim()) {
        return alert("Insira suas informaçoes para criar sua conta!");
    }

    try {
        const response = await fetch("/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                password,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro);
            return;
        }

        console.log(data);
        console.log("Conta criada com sucesso!");

    } catch (error) {
        console.error(error);
    }
}

async function login() {
    const user = document.querySelector(".box-user input").value;
    const password = document.querySelector(".box-password input").value;

    if (!user.trim() || !password.trim()) {
        return alert("Insira seu usuario e senha para entrar!");
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro);
            return;
        }

        console.log(data);
        console.log("Login realizado com sucesso!");

        window.location.href = "https://www.instagram.com/iagopsico/";

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

