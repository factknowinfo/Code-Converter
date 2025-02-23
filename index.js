const GROQ_API_KEY = 'GROQ_API_KEY'; // Replace with your actual API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function convertCode() {
    const sourceCode = document.getElementById('sourceCode').value.trim();
    const inputLanguage = document.getElementById('inputLanguage').value;
    const outputLanguage = document.getElementById('outputLanguage').value;
    const loader = document.getElementById('loader');
    const outputCodeField = document.getElementById('outputCode');

    // Clear previous output
    outputCodeField.value = "";

    // Validate input
    if (!sourceCode) {
        alert("Please enter code before converting.");
        return;
    }
    if (inputLanguage === outputLanguage) {
        alert("Input and output languages cannot be the same.");
        return;
    }

    // Show loader
    loader.style.display = 'block';

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Add your any model
                messages: [
                    {
                        role: "system",
                        content: `Convert the following ${inputLanguage} code to ${outputLanguage}.`
                    },
                    {
                        role: "user",
                        content: sourceCode + "/n Don't write any exta text content or on top language name and ``` ``` in code. only write converted code."
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const convertedCode = data.choices?.[0]?.message?.content || "Error: No valid response from API.";

        outputCodeField.value = convertedCode;
    } catch (error) {
        console.error('Conversion Error:', error);
        outputCodeField.value = 'Error: Failed to convert code.';
    } finally {
        // Hide loader
        loader.style.display = 'none';
    }
}

function copyCode() {
    const outputCodeField = document.getElementById('outputCode');
    outputCodeField.select();
    document.execCommand("copy");
    alert("Code copied to clipboard!");
}

function downloadCode() {
    const outputCode = document.getElementById('outputCode').value;
    const outputLanguage = document.getElementById('outputLanguage').value;

    if (!outputCode) {
        alert("No converted code to download.");
        return;
    }

    const extensions = {
        python: "py",
        javascript: "js",
        cpp: "cpp",
        java: "java",
        c: "c",
        csharp: "cs",
        go: "go",
        php: "php",
        swift: "swift",
        ruby: "rb",
        kotlin: "kt"
    };

    const fileExtension = extensions[outputLanguage] || "txt";
    const filename = `converted_code.${fileExtension}`;
    const blob = new Blob([outputCode], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
