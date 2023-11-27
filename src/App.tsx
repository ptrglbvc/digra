import { useState } from "react";
import latinToCyrillic from "./alphabets/latinToCyrillic.json";
import cyrillicToLatin from "./alphabets/cyrillicToLatin.json";

function App() {
    let [latin, setLatin] = useState("Napiši nešto ovde");
    let [cyrillic, setCyrillic] = useState("Напиши нешто овде");

    function replaceText(text: string, type: string = "latin") {
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
            <div className="text-input-area">
                <p>Latinica</p>
                <textarea
                    value={latin}
                    className="big-input"
                    id="latin"
                    onChange={(e) => replaceText(e.target.value, "latin")}
                    spellCheck="false"
                />
            </div>
            <div className="text-input-area">
                <p>Ћирилица</p>
                <textarea
                    value={cyrillic}
                    className="big-input"
                    id="cyrillic"
                    onChange={(e) => replaceText(e.target.value, "cyrillic")}
                    spellCheck="false"
                />
            </div>
        </>
    );
}

export default App;
