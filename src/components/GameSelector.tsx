import React, { useState, useEffect, useRef } from 'react';
import "../styles/games.css"

type Option = {
    value: string;
    label: string;
};

interface GameSelectorProps {
    onSelect: (option: Option) => void;
    placeholder?: string;
}

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const apiUrl = process.env.REACT_APP_API_URL;

const GameSelector: React.FC<GameSelectorProps> = ({ onSelect, placeholder = "Введите название игры..." }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const isManualChangeRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isManualChangeRef.current) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                fetchOptions(searchTerm);
                setShowOptions(true);
            } else {
                setOptions([]);
                setShowOptions(false);
            }
        }, 500);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [searchTerm]);


    const fetchOptions = async (term: string) => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuthRetry(`${apiUrl}/games?search=${term}`);
            const data = await response.json();
            const formatted = data.map((game: any) => ({
                value: game.id.toString(),
                label: game.name
            }));
            setOptions(formatted);
        } catch (err) {
            console.error("Ошибка загрузки игр:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (option: Option) => {
        isManualChangeRef.current = false; // Программная установка
        setSearchTerm(option.label);
        setShowOptions(false);
        onSelect(option);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isManualChangeRef.current = true; // Пользователь вводит
        setSearchTerm(e.target.value);
    };

    return (
        <div className="custom-select">
            <input
                type="text"
                value={searchTerm}
                placeholder={placeholder}
                onChange={handleInputChange}
                className="search-input"
                onFocus={() => {
                    if (options.length > 0) setShowOptions(true);
                }}
                onBlur={() => {
                    // Небольшая задержка, чтобы можно было кликнуть по элементу
                    setTimeout(() => setShowOptions(false), 150);
                }}
            />
            {showOptions && (
                <div className="options-container">
                    {isLoading ? (
                        <div className="loading">Загрузка...</div>
                    ) : options.length === 0 && searchTerm.trim() !== '' ? (
                        <div className="no-options">Нет совпадений</div>
                    ) : (
                        options.map(option => (
                            <div
                                key={option.value}
                                className="option-item"
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    function fetchWithAuthRetry(url: string, options: FetchOptions = {}): Promise<Response> {
        const accessToken = localStorage.getItem("access") || "";

        const headers = {
            ...options.headers,
            'Authorization': 'Bearer ' + accessToken
        };

        return fetch(url, {
            ...options,
            headers,
        }).then(response => {
            if (response.status === 401) {
                return refreshAccessToken().then(newAccess => {
                    const retryHeaders = {
                        ...options.headers,
                        'Authorization': 'Bearer ' + newAccess
                    };
                    return fetch(url, {
                        ...options,
                        headers: retryHeaders
                    });
                });
            }
            return response;
        });
    }

    function refreshAccessToken(): Promise<string> {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            return Promise.reject(new Error("No refresh token found"));
        }

        return fetch(`${apiUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
            .then(response => {
                if (!response.ok) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.assign('/');
                }
                return response.json();
            })
            .then((data: { access: string }) => {
                localStorage.setItem("access", data.access);
                return data.access;
            });
    }
};

export default GameSelector;
