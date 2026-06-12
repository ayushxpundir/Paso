// --- Element Selectors ---
const numberInput = document.getElementById('myinput');
const resultDiv = document.getElementById('result');
const generateBtn = document.getElementById('mysub');
const copyBtn = document.getElementById('copyBtn');
// Select the container wrapper to manipulate dynamic padding fields
const resultContainer = document.querySelector('.result-container');

// --- SVG Icon Templates ---
const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const tickIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

// --- Prevent Invalid Character Entries ---
numberInput.addEventListener('keydown', function (event) {
    const invalidChars = ['e', 'E', '+', '-', '.'];
    if (invalidChars.includes(event.key)) {
        event.preventDefault(); 
    }
});

// --- Main Password Generation Click Handler ---
generateBtn.onclick = function () {
    const passwordlength = Number(numberInput.value);

    // 1. Validate Password Length First (Min 5 to Max 100)
    if (passwordlength > 100 || passwordlength < 5) {
        resultDiv.textContent = "Please enter between 05 to 100";
        resultDiv.classList.add('result-placeholder'); // Treat warning message as placeholder
        resultContainer.classList.remove('has-password'); // Keeps the text perfectly centered
        copyBtn.style.display = 'none'; // Hide copy button if layout error occurs
        return;
    }
    
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
        let guaranteedChars = []; 

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

        if (allowedchars.length === 0) {
            return "Please select at least one box!";
        }

        let passwordArray = [...guaranteedChars];
        const remainingLength = passwordlength - guaranteedChars.length;

        for (let i = 0; i < remainingLength; i++) {
            const randomindex = Math.floor(Math.random() * allowedchars.length);
            passwordArray.push(allowedchars[randomindex]);
        }

        // Shuffle elements
        for (let i = passwordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }

        return passwordArray.join("");
    }

    // 4. Run the machine and capture value
    const finalPassword = generatepassword(
        passwordlength,
        includelowercase,
        includeUppercase,
        includenumbers,
        includesymbols
    );

    // 5. Display the result
    resultDiv.innerHTML = finalPassword;

    // 6. Manage placeholder/copy button state adjustments
    if (finalPassword === "Please select at least one box!") {
        resultDiv.classList.add('result-placeholder');
        resultContainer.classList.remove('has-password'); // Keeps the text perfectly centered
        copyBtn.style.display = 'none'; // Hide if validation failed
    } else {
        resultDiv.classList.remove('result-placeholder'); // CRITICAL: This allows copying to work!
        resultContainer.classList.add('has-password'); // Adds padding offset only when copy button is visible
        copyBtn.style.display = 'inline-flex'; // Safely reveal copy icon
        
        // Always reset copy icon back to native layout states
        copyBtn.innerHTML = copyIconSvg;
        copyBtn.classList.remove('copied');
    }
};

// --- Select All Checkbox Handler ---
document.getElementById('selectAll').onchange = function () {
    const isChecked = this.checked; 

    document.getElementById('c1').checked = isChecked;
    document.getElementById('c2').checked = isChecked;
    document.getElementById('c3').checked = isChecked;
    document.getElementById('c4').checked = isChecked;
};

// --- Copy to Clipboard Functionality with Tick Mark Feedback ---
copyBtn.addEventListener('click', () => {
    const passwordToCopy = resultDiv.innerText;
    
    // Guard clause checking to make sure it's not active placeholder context
    if (!passwordToCopy || resultDiv.classList.contains('result-placeholder')) return;

    // Web Clipboard API Action
    navigator.clipboard.writeText(passwordToCopy).then(() => {
        // Turn layout green and switch out default icon structure for a clean checkmark
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = tickIconSvg;

        // Revert cleanly back to original layout elements after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = copyIconSvg;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});