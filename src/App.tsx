import { useState, useEffect, useRef } from "react";
import latinToCyrillic from "./alphabets/latinToCyrillic.json";
import cyrillicToLatin from "./alphabets/cyrillicToLatin.json";

type Script = {
    type: "cyrillic" | "latin";
};

function App() {
    let [latin, setLatin] = useState("Napiši nešto ovde");
    let [cyrillic, setCyrillic] = useState("Напиши нешто овде");
    let cyrillicRef = useRef<any>();
    let latinRef = useRef<any>();

    useEffect(() => {
        const handleClick = (event: Event) => {
            //check if the user clicked the button many times in a row, would probably
            //be better if I coded these values in an object,
            //but I think that this project is too small for that
            const button = event.currentTarget as HTMLElement;
            if (button.innerHTML === "Kopirano") button.innerHTML = "Kopiraj";
            if (button.innerHTML === "Pejstovano") button.innerHTML = "Pejstuj";

            const oldButtonText = button.innerHTML;

            if (oldButtonText === "Kopiraj") button.innerHTML = "Kopirano";
            else if (oldButtonText === "Pejstuj")
                button.innerHTML = "Pejstovano";

            button.className = "neo-button";
            setTimeout(() => {
                button.className = "button";
                button.innerHTML = oldButtonText;
            }, 800);
        };

        let buttons = document.getElementsByClassName("button");

        for (let button of buttons) {
            button.addEventListener("click", handleClick);
        }
        return () => {
            for (let button of buttons)
                button.removeEventListener("click", handleClick);
        };
    }, []);

    function replaceText(text: string, { type }: Script) {
        let letters = type === "latin" ? latinToCyrillic : cyrillicToLatin;
        if (type === "latin") setLatin(text);
        else setCyrillic(text);

        let newText = "";
        for (let i = 0; i < text.length; i++) {
            // we check for digraphs only after we confirmed that we're not at the very end of the string
            if (text[i + 1] != undefined) {
                let digraphCandidate = text[i] + text[i + 1];
                if (digraphCandidate in letters.digraphs) {
                    newText += (letters.digraphs as any)[digraphCandidate];
                    i++;
                    continue;
                }
            }

            //then we check for the regular letters
            if (text[i] in letters.regularLetters) {
                newText += (letters.regularLetters as any)[text[i]];
                continue;
            }

            //and then we just copy paste the letters if there's no match
            newText += text[i];
        }
        let oldTargetText = type === "latin" ? cyrillic : latin;
        if (oldTargetText != newText) {
            if (type === "latin") setCyrillic(newText);
            else setLatin(newText);
        }
    }

    return (
        <>
            <div className="text-input-area latin-area">
                <p>Latinica</p>
                <textarea
                    ref={latinRef}
                    value={latin}
                    className="big-input"
                    id="latin"
                    onChange={(e) =>
                        replaceText(e.target.value, { type: "latin" })
                    }
                    spellCheck="false"
                />
                <div className="button-area">
                    <button
                        className="button"
                        onClick={() => {
                            if (latin.trim())
                                navigator.clipboard.writeText(latin);
                        }}
                    >
                        Kopiraj
                    </button>
                    <button
                        className="button"
                        onClick={async () => {
                            let pasta = await navigator.clipboard.readText();
                            let latin = document.getElementById("latin");
                            if (latin != null) latin.textContent = pasta;
                            else return;
                            replaceText(latin?.textContent as string, {
                                type: "latin",
                            });
                            document.getElementsByClassName("paste-button");

                            if (cyrillicRef.current)
                                cyrillicRef.current.focus();
                        }}
                    >
                        Pejstuj
                    </button>
                </div>
            </div>
            <div className="text-input-area cyrillic-area">
                <p>Ћирилица</p>
                <textarea
                    ref={cyrillicRef}
                    value={cyrillic}
                    className="big-input"
                    id="cyrillic"
                    onChange={(e) =>
                        replaceText(e.target.value, { type: "cyrillic" })
                    }
                    spellCheck="false"
                />
                <div className="button-area">
                    <button
                        className="button"
                        onClick={() => {
                            if (cyrillic.trim())
                                navigator.clipboard.writeText(cyrillic);
                        }}
                    >
                        Kopiraj
                    </button>
                    <button
                        className="button"
                        onClick={async () => {
                            let pasta = await navigator.clipboard.readText();
                            let cyrillic = document.getElementById("cyrillic");
                            if (cyrillic != null) cyrillic.textContent = pasta;
                            else return;
                            replaceText(cyrillic?.textContent as string, {
                                type: "cyrillic",
                            });

                            if (latinRef.current) latinRef.current.focus();
                        }}
                    >
                        Pejstuj
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;
