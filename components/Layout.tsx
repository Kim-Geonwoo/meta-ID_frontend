import Header from './Header';
import Footer from './Footer';
import PageBar from './PageBar';
import PrelineScript from "./PrelineScript";
import AppBar from "./AppBar"

const Layout = ({ children }) => (
  <div className="flex flex-wrap">
    <PrelineScript />
    <AppBar />
    <div className="fixed bottom-0 w-full flex justify-center">
    </div>
    <main className="flex w-full justify-center p-4 max-w-md mx-auto">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;