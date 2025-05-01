import React, {useState} from "react";
import {Person} from "../../models/Person";
import PasswordForm from "../forms/PasswordForm";
import Form from "../forms/Form";

const apiUrl = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;

interface LoginFormProps {
    location: string
}

const LoginForm: React.FC<LoginFormProps> = ({location}) => {
    const [passwordError, setPasswordError] = useState("");
    const [nameValid, setNameValid] = useState(true);

    let buttonText = location === "registration" ? 'Зарегистрироваться' : 'Войти';
    let [passwordText, setPasswordText] = useState("");
    let [nameText, setNameText] = useState("");


    function checkName() {
        if (nameText.length === 0) {
            setNameValid(false);
            return false;
        }
        return true;
    }

    function checkPassword() {
        const containsLetters = /^.*[a-zA-Z]+.*$/
        const minimum6Chars = /^.{6,}$/
        if (!(containsLetters.test(passwordText) &&
            minimum6Chars.test(passwordText))) {
            setPasswordError("Пароль должен быть от 6 символов и содержать буквы латинского алфавита");
            return false;
        }
        return true;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let name = checkName();
        let password = checkPassword();

        if (!name || !password) return;

        let person = new Person(nameText, passwordText);

        let url = apiUrl + (location === "registration" ? '/registration' : '/login');
        fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person),
        }).then(function (response) {
            response.json()
                .then(function (data) {
                    if (data["header"] !== "error") {
                        localStorage.setItem("jwt", data["content"]);
                        if (data["content"].includes('*')) {
                            let parts = data["content"].split("*")
                            localStorage.setItem("admin", parts[1]);
                            localStorage.setItem("jwt", parts[0]);
                        }
                        window.location.assign(appUrl === undefined ? 'http://localhost:3000' : appUrl);
                    } else {
                        setPasswordError(data["content"]);
                    }
                })
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            throw error;
        });
    }

    function handlePasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        setPasswordError("");
        setPasswordText(inputValue);
    }

    function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        let lastChar = inputValue.charAt(inputValue.length - 1);
        if (!(/^[a-zA-Zа-яА-Я-]+$/.test(lastChar))) {
            e.target.value = inputValue.slice(0, -1);
        }
        setNameValid(true);
        setNameText(inputValue);
    }

    return (
        <form action="" method="POST" className="registration_form" onSubmit={handleSubmit}>
            <Form handleInput={handleNameInput} error={nameValid ? "" : "Поле не может быть пустым"}
                  text={nameText} label="Имя" name="name"/>
            <PasswordForm handleInput={handlePasswordInput} error={passwordError}
                          passwordText={passwordText} label="Пароль"/>
            <button type="submit" className="registration_form_button">{buttonText}</button>
        </form>
    )
}

export default LoginForm;