import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profileActions'
import Spinner from '../common/Spinner'
import { Link } from 'react-router-dom'

class Dashboard extends Component {

    constructor() {
        super();
    }

    onChange(e) {

    }

    componentDidMount() {
        this.props.getCurrentProfile();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ profile: nextProps.profile })
        }
    }




    render() {

        const { user } = this.props.auth;

        const { profile, loading } = this.props.profile;

        let dashboardContent;

        if (profile === null || loading) {
            dashboardContent = <Spinner />;
        } else {
            
            if(Object.keys(profile).length >0){
                dashboardContent=<h4>TODO: Display profile</h4>
            }
            else{

                dashboardContent = (
                    <div>

                        <p className='lead text-muted'>Welcome {user.name}</p>
                        <p>You haven't created profile yet. Please add some info.</p>
                        <Link to='/create-profile' className='btn btn-info btn-lg'>Create Profile</Link>
                    </div>
                )
            }    
            
        }

        return (
            <div classname="dashboard">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                             <h1 className="display-4">Dashboard</h1>
                            {dashboardContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);