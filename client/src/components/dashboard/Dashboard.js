import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

import {
  getCurrentProfile as getCurrentProfileAction,
  deleteAccount as deleteAccountAction,
} from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className="my-2">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => deleteAccount()}
            >
              <i className="fas fas-user-minus"></i>Delete my Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet set up a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func,
};

const mapState = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapState, {
  getCurrentProfile: getCurrentProfileAction,
  deleteAccount: deleteAccountAction,
})(Dashboard);
