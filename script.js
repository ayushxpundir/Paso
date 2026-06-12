const numberInput = document.getElementById('myinput');

numberInput.addEventListener('keydown', function (event) {
    // Array of characters we want to completely block
    const invalidChars = ['e', 'E', '+', '-', '.'];

    if (invalidChars.includes(event.key)) {
        event.preventDefault(); // This stops the character from being typed
    }
});

document.getElementById('mysub').onclick = function () {

    const passwordlength = Number(document.getElementById('myinput').value);

    // 1. Validate Password Length First (Min 5 to Max 35)
    if (passwordlength > 35 || passwordlength < 5) {
        document.getElementById('result').textContent = "Please enter between 05 to 35";
    }
    else {
        // 2. Safely read the checkbox inputs
        const includelowercase = document.getElementById('c1').checked;
        const includeUppercase = document.getElementById('c2').checked;
        const includesymbols = document.getElementById('c3').checked;
        const includenumbers = document.getElementById('c4').checked;

        // 3. Define the Blueprint Machine
        function generatepassword(
            passwordlength,
            includelowercase,
            includeUppercase,
            includenumbers,
            includesymbols
        ) {
            const lowercase = "abcdefghijklmnopqrstuvwxyz";
            const uppercase = lowercase.toUpperCase();
            const number = "1234567890";
            const symbols = "!@#$%^&*()_+-=";

            let allowedchars = "";
            let guaranteedChars = []; // Array to store mandatory individual characters

            // Add characters to the mixed pool AND snap up one guaranteed character for each checked box
            if (includelowercase) {
                allowedchars += lowercase;
                guaranteedChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
            }
            if (includeUppercase) {
                allowedchars += uppercase;
                guaranteedChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
            }
            if (includenumbers) {
                allowedchars += number;
                guaranteedChars.push(number[Math.floor(Math.random() * number.length)]);
            }
            if (includesymbols) {
                allowedchars += symbols;
                guaranteedChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }

            // Safety check: returns just the string directly if nothing is selected
            if (allowedchars.length === 0) {
                return "Please select at least one box!";
            }

            // Convert our guaranteed characters into our primary password container array
            let passwordArray = [...guaranteedChars];
            const remainingLength = passwordlength - guaranteedChars.length;

            // Fill up the rest of the requested length with random choices from the mixed pool
            for (let i = 0; i < remainingLength; i++) {
                const randomindex = Math.floor(Math.random() * allowedchars.length);
                passwordArray.push(allowedchars[randomindex]);
            }

            // Shuffle the array elements around so the guaranteed characters aren't clustered at the front
            for (let i = passwordArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                let temp = passwordArray[i];
                passwordArray[i] = passwordArray[j];
                passwordArray[j] = temp;
            }

            // Reassemble the array items back into a plain string text format with a clean HTML line break
            return passwordArray.join("");
        }

        // 4. Run the machine and catch the value
        const finalPassword = generatepassword(
            passwordlength,
            includelowercase,
            includeUppercase,
            includenumbers,
            includesymbols
        );

        // 5. Display the result using .innerHTML so the browser properly translates the <br> line break
        document.getElementById('result').innerHTML = finalPassword;
    }
};

// --- Select All Checkbox Handler ---
document.getElementById('selectAll').onchange = function () {
    const isChecked = this.checked; // Uses 'this' to cleanly capture true/false state from 'selectAll'

    document.getElementById('c1').checked = isChecked;
    document.getElementById('c2').checked = isChecked;
    document.getElementById('c3').checked = isChecked;
    document.getElementById('c4').checked = isChecked;
};