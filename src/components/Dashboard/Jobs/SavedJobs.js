import React, { useState, useEffect } from 'react'

import axiosWithAuth from "../../../utils/axiosWithAuth"

import { connect } from "react-redux"
import styled from "styled-components";
import { Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";


//Component that makes up the Saved Jobs page on site
function SavedJobs(props) {

    console.log('props in savedjobs', props)
    const [save, setSave] = useState([])
    const [loading, setLoading] = useState(false);
  

    const id = props.currentUser.id


    //axiosWithAuth is getting the saved id's that are made on the SuggestedJobs component whenever you click the save button
    useEffect(() => {
        setLoading(true);
        axiosWithAuth().get(`/saved/${id}`)
            .then(res => {
                console.log('response from save jobs', res.data)
                let SavedCopy = res.data.filter((e) => e.status === "saved")
                setSave(SavedCopy)
                setLoading(false);
            })
            .catch(error => {
                console.error(error.message)
                setLoading(false);
            })
    }, [id])

    //deletes the selected saved job
    const handleDelete = (job_id) => {
        setLoading(true)
        axiosWithAuth().delete(`/saved/${job_id}`)
            .then(res => {
                let SavedCopy = save.filter((e) => e.job_id !== job_id)
                console.log('erased job from saved table', res.data)
                setLoading(false)
                setSave(SavedCopy)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })
    }

    //pushes saved jobs to here, and also returns nothing is available if you haven't saved any jobs, with a link back to the dashboard.
    const JobDetails = (job_id) => {
        setTimeout(() => {
            props.history.push(`/Dashboard/Job/${job_id}`)
        }, 100)  
    }

    //if loading is happening, then only return loader
    if(loading === true ) {
        return (
            <StyledLoader active={loading} spinner text='Loading...'/>
        )
    } 
    // else, return this 
    return (
        <StyledLoader active={loading} spinner text='Loading...'>
            {/* if save.length 1>= x < 3, then assign css class saved-jobs-small */}
            <div className={(save.length === 1 ? "saved-jobs-single" : (save.length === 2 ? "saved-jobs-small" : "saved-jobs-main"))}>
            {(save.length < 1 ?     
            //if object is empty, render empty message 
            <div className="empty-jobs">
                <div className="animated flipInX"><h1>Nothing here yet...Save a job in Dashboard to continue!
                </h1></div>
             </div>: save.map((e) => {
                    return (
                        <div key={id} className="card-saved-jobs" >
                            <h3>{e.companyName}</h3>
                            <h5>📍{e.city} {e.stateOrProvince}, {e.country}</h5>
                            <p> Overview <br></br>{e.description.slice(0, 250)}...</p>
                            <div className="saved-buttons">
                                <button onClick={() => handleDelete(e.job_id)}>Unsave</button>
                                <button onClick={() => JobDetails(e.job_id)}>More Info</button>
                            </div>
                        </div>
                    )
             
                }))}
            </div>
        </StyledLoader>
    )
}

const mapStateToProps = state => {
    return {
        currentUser: state.AppReducer.currentUser,
    }
}
export default connect(mapStateToProps, {})(SavedJobs)

const StyledLoader = styled(LoadingOverlay)`
    min-height: 100vh;
    width:100%;
    z-index: 2;
`;

