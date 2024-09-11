
export class emailInput {
    constructor(input) {
        this.input = input;
    }
    verify() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.input)) {
            alert("Invalid email format");
            console.log("Invalid email format");
            return false;
        } else {
            return true;
        }
    }
}
export class passwordInput extends emailInput {
    verify() {
        const hasNumber = /\d/.test(this.input);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?]/g.test(this.input);

        if (!hasNumber || !hasSpecialChar) {
            alert("Password must contain at least 1 number and 1 special character");
            return false;
        } else {
            return true;
        }
    }
}



