import React from "react";
import logo from "../../static/logo.png";
import {Link} from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="logo_and_button">
                <Link to="/">
                    <img src={logo} style={{width: '70%'}} alt="emblem"/>
                </Link>
            </div>
        </footer>
    )
}

export default Footer;