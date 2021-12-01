import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext } from '../context/context';
const Dashboard = () => {
  const {loading} = React.useContext(GithubContext)
  if (loading) {
    return <main>
      <img src={loadingImage} className='loading-img' alt='loading'/>
    </main>
  }

  return (
    <main>
      <Navbar></Navbar>
      <Search></Search>
      <Info></Info>
      <User></User> 
      <Repos></Repos>
    </main>
  );
};

export default Dashboard;
