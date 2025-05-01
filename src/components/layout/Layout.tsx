import React, {ReactNode} from 'react';

import Header from "./Header";
import Footer from "./Footer";

import "../../styles/layout/layout.css"



interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <div>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
