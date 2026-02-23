import { useContext, useState, useEffect } from "react";
import "./../assets/scss/MainScreen.scss";
import { GlobalContext } from "./GlobalContext.jsx";
import { THEMES } from "../constants/constants.jsx";

export default function MainScreen({ solvePuzzle, solved, solvedTrigger }) {
    const { appSettings: config, I18n } = useContext(GlobalContext);
    const [inputText, setInputText] = useState("");
    const [shift, setShift] = useState(1);
    const [mode, setMode] = useState(config.hasLinkedPuzzles ? null : "encrypt"); // "encrypt", "decrypt" or null
    const [outputText, setOutputText] = useState("");
    const [lang, setLang] = useState(I18n.getLocale() || "en");
    const [caseOption, setCaseOption] = useState("upper");
    const [feedbackStatus, setFeedbackStatus] = useState(null);

    const ALPHABET_ES = "abcdefghijklmnñopqrstuvwxyz";
    const ALPHABET_EN = "abcdefghijklmnopqrstuvwxyz";
    // Simplified Serbian Latin alphabet (single chars)
    const ALPHABET_SR = "abcčćdđefghijklmnoprsštuvzž";

    const getAlphabet = (currentLang, currentCase) => {
        let base = ALPHABET_ES;
        if (currentLang === "sr") base = ALPHABET_SR;
        if (currentLang === "en") base = ALPHABET_EN;
        return currentCase === "both" ? base + base.toUpperCase() : base.toUpperCase();
    };

    const caesarCipher = (str, currentShift, currentMode, currentLang, currentCase) => {
        const alphabet = getAlphabet(currentLang, currentCase);
        const length = alphabet.length;

        // Normalize shift
        let actualShift = parseInt(currentShift) || 0;
        if (actualShift < 0) actualShift = length + (actualShift % length);

        // If decrypting, reverse the shift
        if (currentMode === "decrypt") {
            actualShift = (length - (actualShift % length)) % length;
        }

        return str.split("").map(char => {
            const searchChar = currentCase === "upper" ? char.toUpperCase() : char;
            const index = alphabet.indexOf(searchChar);
            if (index !== -1) {
                return alphabet[(index + actualShift) % length];
            }
            return currentCase === "upper" ? char.toUpperCase() : char;
        }).join("");
    };

    const handleLangChange = (newLang) => {
        if (I18n.setLocale(newLang)) {
            setLang(newLang);
        }
    };

    useEffect(() => {
        // feedback to user if is solved
        if (solvedTrigger > 0) {
            if (solved) {
                setFeedbackStatus("success");
            } else {
                setFeedbackStatus("error");
                setTimeout(() => setFeedbackStatus(null), 1000);
            }
        }
    }, [solvedTrigger, solved]);

    useEffect(() => {
        if (!config.hasLinkedPuzzles) {
            const currentMode = mode || "encrypt";
            setOutputText(caesarCipher(inputText, shift, currentMode, lang, caseOption));
        }
    }, [inputText, shift, mode, lang, caseOption, config.hasLinkedPuzzles]);

    const handleModeClick = (action) => {
        if (config.hasLinkedPuzzles) {
            const result = caesarCipher(inputText, shift, action, lang, caseOption);
            setOutputText(result);
            solvePuzzle(result);
        } else {
            setMode(action);
        }
    };

    const alphabetLength = getAlphabet(lang, caseOption).length;
    const hasScreenFrame = config.skin === THEMES.RETRO || config.skin === THEMES.FUTURISTIC;

    const caesarContent = (
        <div className={`caesar-container ${feedbackStatus || ""}`}>
            <div className="header-row">
                <h1 className="title">{I18n.getTrans("i.caesarTitle")}</h1>
                {!config.locale && (
                    <div className="language-switch">
                        <button
                            className={lang === "es" ? "active" : ""}
                            onClick={() => handleLangChange("es")}
                        >
                            ES
                        </button>
                        <button
                            className={lang === "en" ? "active" : ""}
                            onClick={() => handleLangChange("en")}
                        >
                            EN
                        </button>
                        <button
                            className={lang === "sr" ? "active" : ""}
                            onClick={() => handleLangChange("sr")}
                        >
                            SR
                        </button>
                    </div>
                )}
            </div>

            <div className="controls">
                <div className="control-group mode-switch">
                    <button
                        className={caseOption === "both" ? "active" : ""}
                        onClick={() => {
                            setCaseOption("both");
                        }}
                    >
                        {I18n.getTrans("i.caseBoth") || "Aa"}
                    </button>
                    <button
                        className={caseOption === "upper" ? "active" : ""}
                        onClick={() => {
                            setCaseOption("upper");
                            if (shift >= (getAlphabet(lang, "upper").length - 1)) {
                                setShift(1);
                            }
                        }}
                    >
                        {I18n.getTrans("i.caseUpper") || "AA"}
                    </button>
                </div>

                <div className="control-group">
                    <label>{I18n.getTrans("i.shift")}</label>
                    <input
                        type="number"
                        value={shift}
                        onChange={(e) => setShift(parseInt(e.target.value))}
                        min="1"
                        max={alphabetLength - 1}
                    />
                </div>

                <div className="control-group mode-switch">
                    <button
                        className={mode === "encrypt" ? "active" : ""}
                        onClick={() => handleModeClick("encrypt")}
                    >
                        {I18n.getTrans("i.encrypt")}
                    </button>
                    <button
                        className={mode === "decrypt" ? "active" : ""}
                        onClick={() => handleModeClick("decrypt")}
                    >
                        {I18n.getTrans("i.decrypt")}
                    </button>
                </div>
            </div>

            <div className="text-areas">
                <div className="text-group">
                    <label>{I18n.getTrans("i.inputLabel")}</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={I18n.getTrans("i.inputPlaceholder")}
                        spellCheck="false"
                    />
                </div>

                <div className="text-group">
                    <label>{I18n.getTrans("i.outputLabel")}</label>
                    <textarea
                        value={outputText}
                        readOnly
                        placeholder={I18n.getTrans("i.outputPlaceholder")}
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className={`mainScreen`}>
            {hasScreenFrame ? (
                <div className="retro-monitor">
                    {/* The Screen Content (Behind the Frame) */}
                    <div className="crt-screen">
                        <div className="screen-background">
                            {caesarContent}
                        </div>
                    </div>
                    {/* The Frame Overlay (On top of content) */}
                    <img
                        src={config.screenImage || config.screenFrameImage}
                        className="monitor-frame"
                        alt="Monitor Frame"
                    />
                </div>
            ) : (
                caesarContent
            )}
        </div>
    );
}
