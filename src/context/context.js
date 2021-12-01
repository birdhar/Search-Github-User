import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) => {

const [githubUser, setGithubUser] = useState(mockUser)
const [followers, setFollowers] = useState(mockFollowers)
const [repos, setRepos] = useState(mockRepos)

const [requests, setRequests] = useState(0)
const [loading, setLoading] = useState(false)

const [error, setError] = useState({show: false, msg: ''})

const searchUser = async(user) => {
    toggleError() 
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).
    catch(error=>console.log(error))

    

    if(response){
        setGithubUser(response.data)
        
        const {login, followers_url} = response.data;
        axios(`${rootUrl}/users/${login}/repos?per_page=100`)
        .then(response=>setRepos(response.data))

        axios(`${followers_url}?per_page=100`)
        .then(response=>setFollowers(response.data))
    }else{
        toggleError(true,'User not found with that username')
    }
    checkRequests();
    setLoading(false);
}

const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
    .then(({data})=>{
        let {rate:{remaining}} = data;
        setRequests(remaining);
        if (remaining === 0) {
            toggleError({show: true, msg: 'Sorry, you have exceeded request limit'})
        } 
    })
    .catch((error)=>console.log(error))
}

const toggleError = (show =false ,msg='') => {
    setError({show,msg})
}

useEffect(checkRequests, [])


    return (
        <GithubContext.Provider value={{githubUser, followers, 
        repos, error, searchUser, requests,loading}}>
        {children}</GithubContext.Provider>
    );
};

export {GithubProvider, GithubContext}