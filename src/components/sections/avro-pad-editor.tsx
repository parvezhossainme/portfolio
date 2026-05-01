"use client";

import {
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
} from "react";

import avroPhonetic from "nodejs-avro-phonetic";

type Mode = "bn" | "en";

type EditorState = {
    mode: Mode;
    text: string;
    compose: string;
};

type SuggestionItem = {
    label: string;
    roman: string;
    isRoman?: boolean;
};

type PopupPosition = {
    left: number;
    top: number;
    visible: boolean;
};

type EditorAction =
    | { type: "toggle-mode" }
    | { type: "insert-char"; char: string }
    | { type: "backspace" }
    | { type: "commit"; separator: string }
    | { type: "paste"; text: string }
    | { type: "append-compose"; text: string }
    | { type: "set-compose"; compose: string }
    | { type: "accept-suggestion"; value: string }
    | { type: "set-text"; text: string };

const initialState: EditorState = {
    mode: "bn",
    text: "",
    compose: "",
};

function removeLastCharacter(value: string) {
    return Array.from(value).slice(0, -1).join("");
}

function buildSuggestionItems(compose: string): SuggestionItem[] {
    if (!compose) {
        return [];
    }

    const romanVariants = [
        compose,
        compose.slice(0, -1),
        compose.slice(1),
        compose.replace(/[aeiou]$/i, ""),
        `${compose}a`,
        `${compose}i`,
        `${compose}o`,
        `${compose}r`,
    ];

    const suggestions: SuggestionItem[] = [];
    const seen = new Set<string>();

    for (const roman of romanVariants) {
        if (!roman) {
            continue;
        }

        const label = avroPhonetic.parse(roman);

        if (!label || seen.has(label)) {
            continue;
        }

        seen.add(label);
        suggestions.push({ label, roman });
    }

    if (!seen.has(compose)) {
        suggestions.push({ label: compose, roman: compose, isRoman: true });
    }

    return suggestions.slice(0, 4);
}

function measureCaretAnchor(
    textarea: HTMLTextAreaElement,
    text: string,
    popupWidth: number,
) {
    const container = textarea.parentElement;

    if (!container) {
        return null;
    }

    const computedStyle = window.getComputedStyle(textarea);
    const mirror = document.createElement("div");
    const marker = document.createElement("span");

    mirror.style.position = "absolute";
    mirror.style.visibility = "hidden";
    mirror.style.pointerEvents = "none";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordBreak = "break-word";
    mirror.style.overflow = "hidden";
    mirror.style.inset = "0";
    mirror.style.margin = computedStyle.margin;
    mirror.style.padding = computedStyle.padding;
    mirror.style.border = computedStyle.border;
    mirror.style.boxSizing = computedStyle.boxSizing;
    mirror.style.width = `${textarea.clientWidth}px`;
    mirror.style.height = `${textarea.clientHeight}px`;
    mirror.style.font = computedStyle.font;
    mirror.style.fontSize = computedStyle.fontSize;
    mirror.style.fontFamily = computedStyle.fontFamily;
    mirror.style.fontWeight = computedStyle.fontWeight;
    mirror.style.fontStyle = computedStyle.fontStyle;
    mirror.style.letterSpacing = computedStyle.letterSpacing;
    mirror.style.lineHeight = computedStyle.lineHeight;
    mirror.style.textIndent = computedStyle.textIndent;
    mirror.style.textTransform = computedStyle.textTransform;
    mirror.style.textAlign = computedStyle.textAlign;
    mirror.style.direction = computedStyle.direction;
    mirror.style.tabSize = computedStyle.tabSize;
    mirror.style.overflowWrap = "break-word";

    const caretPosition = textarea.selectionStart ?? text.length;
    mirror.textContent = text.slice(0, caretPosition);
    marker.textContent = "\u200b";
    mirror.appendChild(marker);
    mirror.appendChild(document.createTextNode(text.slice(caretPosition)));
    container.appendChild(mirror);

    const containerRect = container.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24;
    const availableWidth = containerRect.width - popupWidth - 12;
    const left = Math.max(
        12,
        Math.min(markerRect.left - containerRect.left, availableWidth),
    );
    const top = Math.max(
        12,
        markerRect.top - containerRect.top + lineHeight + 6,
    );

    container.removeChild(mirror);

    return { left, top };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case "toggle-mode": {
            if (state.mode === "bn") {
                return {
                    mode: "en",
                    text: `${state.text}${avroPhonetic.parse(state.compose)}`,
                    compose: "",
                };
            }

            return {
                ...state,
                mode: "bn",
            };
        }
        case "insert-char": {
            if (state.mode === "bn") {
                return {
                    ...state,
                    compose: `${state.compose}${action.char}`,
                };
            }

            return {
                ...state,
                text: `${state.text}${action.char}`,
            };
        }
        case "backspace": {
            if (state.mode === "bn" && state.compose) {
                return {
                    ...state,
                    compose: removeLastCharacter(state.compose),
                };
            }

            return {
                ...state,
                text: removeLastCharacter(state.text),
            };
        }
        case "commit": {
            if (state.mode !== "bn") {
                return state;
            }

            return {
                ...state,
                text: `${state.text}${avroPhonetic.parse(state.compose)}${action.separator}`,
                compose: "",
            };
        }
        case "paste": {
            if (state.mode === "bn") {
                return {
                    ...state,
                    text: `${state.text}${avroPhonetic.parse(state.compose)}${avroPhonetic.parse(action.text)}`,
                    compose: "",
                };
            }

            return {
                ...state,
                text: `${state.text}${action.text}`,
            };
        }
        case "append-compose": {
            if (state.mode !== "bn") {
                return state;
            }

            return {
                ...state,
                compose: `${state.compose}${action.text}`,
            };
        }
        case "set-compose": {
            if (state.mode !== "bn") {
                return state;
            }

            return {
                ...state,
                compose: action.compose,
            };
        }
        case "accept-suggestion": {
            if (state.mode !== "bn") {
                return state;
            }

            return {
                ...state,
                text: `${state.text}${action.value}`,
                compose: "",
            };
        }
        case "set-text": {
            return {
                ...state,
                text: action.text,
            };
        }
        default: {
            return state;
        }
    }
}

function ModePill({ active, children }: { active: boolean; children: string }) {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
        >
            {children}
        </span>
    );
}

export function AvroPadEditor() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [state, dispatch] = useReducer(editorReducer, initialState);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [popupPosition, setPopupPosition] = useState<PopupPosition>({
        left: 0,
        top: 0,
        visible: false,
    });

    const displayValue =
        state.mode === "bn" ?
            `${state.text}${avroPhonetic.parse(state.compose)}`
        :   state.text;
    const suggestionItems =
        state.mode === "bn" ? buildSuggestionItems(state.compose) : [];
    const activeSuggestionIndexWithinBounds = Math.min(
        activeSuggestionIndex,
        Math.max(suggestionItems.length - 1, 0),
    );
    const activeSuggestion =
        suggestionItems[activeSuggestionIndexWithinBounds] ||
        suggestionItems[0] ||
        null;

    useEffect(() => {
        if (state.mode !== "bn" || !textareaRef.current) {
            return;
        }

        textareaRef.current.focus();
        const endPosition = displayValue.length;
        textareaRef.current.setSelectionRange(endPosition, endPosition);
    }, [displayValue, state.mode]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea || state.mode !== "bn" || suggestionItems.length === 0) {
            setPopupPosition((current) =>
                current.visible ? { ...current, visible: false } : current,
            );
            return;
        }

        const nextPosition = measureCaretAnchor(textarea, displayValue, 176);

        if (!nextPosition) {
            return;
        }

        setPopupPosition({ ...nextPosition, visible: true });
    }, [displayValue, state.mode, suggestionItems.length]);

    const toggleMode = () => {
        dispatch({ type: "toggle-mode" });
    };

    const commitCompose = (separator = "") => {
        dispatch({ type: "commit", separator });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (state.mode !== "bn") {
            return;
        }

        if (suggestionItems.length > 0) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveSuggestionIndex((currentIndex) =>
                    Math.min(currentIndex + 1, suggestionItems.length - 1),
                );
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveSuggestionIndex((currentIndex) =>
                    Math.max(currentIndex - 1, 0),
                );
                return;
            }

            if (event.key === "Tab" || event.key === "Enter") {
                event.preventDefault();
                dispatch({
                    type: "accept-suggestion",
                    value: activeSuggestion?.label || displayValue,
                });
                return;
            }
        }

        if ((event.ctrlKey || event.metaKey) && event.key === ".") {
            event.preventDefault();
            toggleMode();
            return;
        }

        if (event.key === "Backspace") {
            event.preventDefault();
            dispatch({ type: "backspace" });
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            commitCompose("\n");
            return;
        }

        if (event.key === " ") {
            event.preventDefault();
            commitCompose(" ");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (state.mode === "bn") {
            const nextValue = event.target.value;

            if (nextValue === displayValue) {
                return;
            }

            if (nextValue.length > displayValue.length) {
                dispatch({
                    type: "append-compose",
                    text: nextValue.slice(displayValue.length),
                });
                return;
            }

            if (nextValue.length < displayValue.length) {
                const nextTail = nextValue.slice(state.text.length);
                let nextCompose = "";

                for (let index = state.compose.length; index >= 0; index -= 1) {
                    const candidate = state.compose.slice(0, index);

                    if (avroPhonetic.parse(candidate) === nextTail) {
                        nextCompose = candidate;
                        break;
                    }
                }

                dispatch({ type: "set-compose", compose: nextCompose });
            }

            return;
        }

        if (state.mode === "en") {
            dispatch({ type: "set-text", text: event.target.value });
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (state.mode !== "bn") {
            return;
        }

        event.preventDefault();
        const pastedText = event.clipboardData.getData("text/plain");

        if (!pastedText) {
            return;
        }

        dispatch({ type: "paste", text: pastedText });
    };

    return (
        <section className="relative isolate h-full overflow-hidden bg-transparent">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.03),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_72%_58%_at_50%_0%,#000_56%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
            <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-foreground/5 blur-3xl dark:bg-primary/10" />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col gap-3 p-2 sm:p-3 lg:gap-4 lg:p-4">
                <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border/60 bg-card/80 px-4 py-2.5 shadow-sm sm:px-5">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                            Avro Pad
                        </p>
                        <p className="text-sm text-foreground/80">
                            Type Roman. Get Bangla. Keep the flow.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="inline-flex items-center rounded-full border border-border/60 bg-background p-1 text-xs font-semibold uppercase tracking-[0.24em] text-foreground shadow-sm"
                        aria-label="Toggle input mode"
                    >
                        <ModePill active={state.mode === "bn"}>BN</ModePill>
                        <ModePill active={state.mode === "en"}>EN</ModePill>
                    </button>
                </div>

                <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/85 p-2 shadow-sm sm:p-3">
                    <div className="relative flex  flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm">
                        {suggestionItems.length > 0 ?
                            <div
                                className={`absolute z-20 w-44 overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-[0_24px_40px_rgba(0,0,0,0.14)] transition-opacity duration-100 ${popupPosition.visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                                style={{
                                    left: `${popupPosition.left}px`,
                                    top: `${popupPosition.top}px`,
                                }}
                            >
                                {suggestionItems.map((item, index) => {
                                    const selected =
                                        index ===
                                        activeSuggestionIndexWithinBounds;

                                    return (
                                        <button
                                            key={`${item.label}-${item.roman}`}
                                            type="button"
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                dispatch({
                                                    type: "accept-suggestion",
                                                    value: item.label,
                                                });
                                            }}
                                            className={`flex w-full items-center justify-between border-b border-border/60 px-3 py-2.5 text-left text-sm leading-none transition last:border-b-0 ${
                                                selected ?
                                                    "bg-primary text-primary-foreground"
                                                : item.isRoman ? "text-primary"
                                                : "text-foreground hover:bg-muted/60"
                                            }`}
                                        >
                                            <span className="truncate">
                                                {item.label}
                                            </span>
                                            {selected ?
                                                <span className="ml-2 text-[0.55rem] uppercase tracking-[0.28em] opacity-70">
                                                    selected
                                                </span>
                                            :   null}
                                        </button>
                                    );
                                })}
                            </div>
                        :   null}

                        <textarea
                            ref={textareaRef}
                            value={displayValue}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            onPaste={handlePaste}
                            placeholder="Start typing here..."
                            spellCheck
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            className="min-h-0 flex-1 w-full resize-none bg-transparent p-4 text-[1.02rem] leading-8 text-foreground outline-none placeholder:text-muted-foreground sm:p-5 lg:p-6"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/80 px-4 py-3 text-xs text-muted-foreground sm:px-5">
                            <span>
                                Live suggestions stay close to the caret.
                            </span>
                            <span>Ctrl / Cmd + . switches language mode.</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
