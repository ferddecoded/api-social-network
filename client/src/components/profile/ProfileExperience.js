import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: {
    company,
    title,
    location,
    current,
    to,
    from,
    description
  }
}) => (
  <div>
    <h3 className="text-dark">{company}</h3>
    <p>
      <Moment format="YY/MM/DD">{from}</Moment> - {!to ? ' Now' : <Moment format="YY/MM/DD">{to}</Moment>}
    </p>
    <p>
      <strong>Postion:</strong> {title}
    </p>
    <p>
      <strong>Description:</strong> {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.array,
};

export default ProfileExperience;