import React from "react";

interface MenuHeaderProps {
    handleMenuLinks: any;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({handleMenuLinks}) => {
    return (
        <div className="menu">
            <ul role="list" className="menu_ul" onClick={handleMenuLinks}>
                <li className="menu_li">
                    <a className="menu_li_link" href="/">Подобрать игру</a></li>
                {localStorage.getItem("jwt") === null &&
                    <>
                        <li className="menu_li">
                            <a className="menu_li_link" href="/login">Войти</a>
                        </li>
                        <li className="menu_li">
                            <a className="menu_li_link" href="/registration">Зарегистрироваться</a>
                        </li>
                    </>
                }
            </ul>
        </div>
    )
}
export default MenuHeader;