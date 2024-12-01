import { useState } from "react";
import "./App.css";
import { Route, Routes, Outlet } from "react-router";

function App() {
  const [count, setCount] = useState(0);

  const Home = () => {
    return (
      <>
        <h1>Home</h1>
        <Outlet />
      </>
    );
  };

  const About = () => {
    return (
      <>
        <h1>About</h1>
      </>
    );
  };

  const Dashboard = () => {
    return (
      <>
        <h3>Dashboard</h3>
      </>
    );
  };

  const News = () => {
    return (
      <>
        <h3>News</h3>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="News" element={<News />} />
      </Route>
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
